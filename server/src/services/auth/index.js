import crypto from 'node:crypto';
import { EntityId } from "redis-om";

import InternalError from "../../utilities/internalError.js";
import { globalLogger as log } from '../../utilities/log.js';

import model from "./authCode.model.js";


class AuthService {
	#config = {
		mail: {
			senderAddr: "jals@wirkijowski.dev",
			senderName: "Just Another Link Shortener",
		},
		auth: {
			length: 6,
			expiresIn: 300
		}
	}

	constructor() {
		log.withDomain('success', 'AuthService', 'AuthService started!')

		return this;
	}

	generateCode = () => {
		const length = this.#config.auth.length;

		if (length <= 0) {
			throw new InternalError("Auth length must be greater than 0! Cannot generate auth code.", undefined, 'AuthService', false);
		}

		let code = '';
		while (code.length < length) {
			const byte = crypto.randomBytes(1)[0];
			if (byte < 250) {
				code += (byte % 10).toString();
			}
		}

		return parseInt(code, 10);
	}

	createCode = async (userId, userEmail) => {
		return await new Code(userId, userEmail).save(this.#config.auth.expiresIn).catch(_ => false);
	}

	sendEmail = async () => {

	}
}

export const service = new AuthService();

class Code {
	authCodeId;
	userId;
	userEmail;
	code;
	createdAt;

	constructor(userId, userEmail) {
		const code = service.generateCode();

		this.userId = userId.toString();
		this.userEmail = userEmail;
		this.code = code;

		return this;
	}

	save = async (expiresIn) => {
		this.createdAt = new Date().toISOString();

		if (this.authCodeId) return this;

		const node = await model.save(this);

		if (node.code !== undefined && node.code !== null) {
			this.authCodeID = node[EntityId];

			await model.expire(node[EntityId], expiresIn);

			log.withDomain('audit', 'AuthService', "Authentication code created", this.userId, this.authCodeID);

			return this;
		} else {
			new InternalError("AuthService saved failed!", undefined, 'AuthService', false, {userId: this.userId});
		}
	}
}