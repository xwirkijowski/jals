import {EntityId} from "redis-om";

import InternalError from "../../utilities/internalError.js";

import model from "./authCode.model.js";
import {service, log} from "./index.js";

export default class AuthCode {
	authCodeId;
	userId;
	userEmail;
	code;
	createdAt;

	constructor(props, rId) {
		if (props?.[EntityId] && props?.code) { // Create new instance from existing
			this.authCodeId = props[EntityId];
			this.userId = props.userId;
			this.userEmail = props.userEmail;
			this.code = props.code;
			this.createdAt = props.createdAt;
		} else { // New instance to insert
			if (!props) return this; // Pass to `Find`
			else if (!props?.userId || !props?.userEmail) {
				new InternalError('Code creation failed, no userId and userEmail provided!', undefined, 'AuthService', false, props, {requestId: rId})
				return undefined;
			}

			this.userId = props.userId.toString();
			this.userEmail = props.userEmail.toString();
			this.code = service.generateCode();
		}

		return this;
	}

	static async find (userId, code, rId) {
		const node = await model.search({
			userId: userId.toString(),
			code: code.toString(),
		}).return.first()

		return (node?.code) ? new AuthCode(node) : undefined;
	}

	save = async (expiresIn, rId) => {
		if (this.authCodeId) return undefined;

		this.createdAt = new Date().toISOString(); // Set close to insertion

		const node = await model.save(this);

		if (node.code) {
			this.authCodeId = node[EntityId];

			await model.expire(node[EntityId], expiresIn);

			log.withDomain('audit', 'AuthService', "Authentication code created", {userId: this.userId, authCodeId: this.authCodeId, requestId: rId});

			return this;
		} else {
			new InternalError("AuthCode save failed!", undefined, 'AuthService', false, {userId: this.userId, requestId: rId});
			return undefined;
		}
	}
}