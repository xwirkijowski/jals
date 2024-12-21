import {EntityId} from "redis-om";

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
	ttl;

	constructor(props, rId) {
		if (!props?.userId) {
			new InternalError('Session creation failed, no userId provided!', undefined, 'AuthService', false, props, {requestId: rId})
			return undefined;
		}

		this.userId = props.userId.toString();
		this.userAgent = props?.userAgent?.toString() || props?.request.headers?.['user-agent'] || undefined;
		this.userAddr = props?.userAddr?.toString() || getIP(props?.request)?.toString() || undefined;
		this.updatedAt = undefined;
		this.version = 0;

		return this;
	}

	save = async (expiresIn, rId) => {
		if (this.sessionId) return undefined;

		this.createdAt = new Date().toISOString(); // Set close to insertion

		const node = await model.save(this);

		if (node.userId) {
			this.sessionId = node[EntityId];

			await model.expire(node[EntityId], expiresIn);

			log.withDomain('audit', 'AuthService', "Session created", {userId: this.userId, sessionId: this.sessionId, requestId: rId});

			return this;
		} else {
			new InternalError("Session save failed!", undefined, 'AuthService', false, {userId: this.userId, requestId: rId});
			return undefined;
		}
	}
}