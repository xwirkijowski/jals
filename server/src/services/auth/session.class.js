import {EntityId} from "redis-om";

import {redisClient} from "../../../main.js";
import InternalError from "../../utilities/internalError.js";
import {getIP} from "../../utilities/helpers.js";

import model from "./session.model.js";
import {service, log} from "./index.js";

export default class Session {
	sessionId;
	userId;
	userAgent;
	userAddr;
	createdAt;
	updatedAt;
	version;

	constructor(props, rId) {
		if (!props?.userId) {
			new InternalError('Session creation failed, no userId provided!', undefined, 'AuthService', false, props, {requestId: rId})
			return undefined;
		}

		this.sessionId = props?.sessionId;
		this.userId = props.userId.toString();
		this.userAgent = props?.userAgent?.toString() || props?.request.headers?.['user-agent'] || undefined;
		this.userAddr = props?.userAddr?.toString() || getIP(props?.request)?.toString() || undefined;
		this.createdAt = props?.createdAt ? new Date(props.createdAt) : undefined;
		this.updatedAt = props?.updatedAt ? new Date(props.updatedAt) : undefined;
		this.version = props?.version || 0;

		return this;
	}

	static async find(sessionId, rId){
		const node = await model.fetch(sessionId);

		node.sessionId = node[EntityId];

		return (node?.userId) ? new Session(node, rId) : undefined;
	}

	refresh = async (expiresIn, rId) => {
		if (!this.sessionId) return undefined;

		this.updatedAt = new Date();
		this.version++;

		// Save updated session and update TTL
		await model.save(this.sessionId, this)
		await model.expire(this.sessionId, expiresIn);

		return this;
	}

	save = async (expiresIn, rId) => {
		if (this.sessionId) return undefined;

		this.createdAt = new Date().toISOString(); // Set close to insertion

		const node = await model.save(this);

		if (node.userId) {
			this.sessionId = node[EntityId];

			await model.expire(this.sessionId, expiresIn);

			log.withDomain('audit', 'AuthService', "Session created", {userId: this.userId, sessionId: this.sessionId, requestId: rId});

			return this;
		} else {
			new InternalError("Session save failed!", undefined, 'AuthService', false, {userId: this.userId, requestId: rId});
			return undefined;
		}
	}
}