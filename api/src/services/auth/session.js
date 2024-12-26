import { EntityId } from "redis-om";

import { CriticalError } from './../../utilities/errors/index.js';
import { getIP } from "../../utilities/helpers.js";

import { repository as model } from "./session.model.js";
import { log } from "./service.js";

export default class Session {
	sessionId;
	userId;
	isAdmin;
	userAgent;
	userAddr;
	createdAt;
	updatedAt;
	version;

	constructor(props, rId) {
		if (!props?.userId) {
			new CriticalError('Session creation failed, no userId provided!', 'SESSION_MISSING_ARGS', 'AuthService', true, {requestId: rId, ...props})
			return undefined;
		}

		this.sessionId = props?.sessionId;
		this.userId = props.userId.toString();
		this.isAdmin = Boolean(props?.isAdmin)||false;
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
			new CriticalError("Session save failed!", 'SESSION_SAVE_FAULT', 'AuthService', true, {requestId: rId, session: this});
			return undefined;
		}
	}
}