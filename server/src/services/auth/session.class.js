import {EntityId} from "redis-om";

import InternalError from "../../utilities/internalError.js";

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

	constructor(props) {
		if (!props?.userId) {
			new InternalError('Session creation failed, no userId provided!', undefined, 'AuthService', false, props)
			return undefined;
		}

		this.userId = props.userId.toString();
		this.userAgent = props.userAgent?.toString();
		this.userAddr = props.userAddr?.toString();
		this.updatedAt = undefined;
		this.version = 0;

		return this;
	}

	save = async (expiresIn) => {
		if (this.sessionId) return undefined;

		this.createdAt = new Date().toISOString(); // Set close to insertion

		const node = await model.save(this);

		if (node.code !== undefined && node.code !== null) {
			this.authCodeID = node[EntityId];

			await model.expire(node[EntityId], expiresIn);

			log.withDomain('audit', 'AuthService', "Authentication code created", this.userId, this.authCodeID);

			return this;
		} else {
			new InternalError("Session saved failed!", undefined, 'AuthService', false, {userId: this.userId});
			return undefined;
		}
	}
}