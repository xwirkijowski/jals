import {GraphQLError} from "graphql";

import crypto from 'node:crypto';

import InternalError from "../../utilities/internalError.js";
import { globalLogger as log } from '../../utilities/log.js';
export {log};

import Session from "./session.class.js";
import AuthCode from "./authCode.class.js";

class AuthService {
	#config = {
		mail: {
			senderAddr: "jals@wirkijowski.dev",
			senderName: "Just Another Link Shortener",
		},
		auth: {
			code: {
				length: 6,
				expiresIn: 60 * 5,
			},
			session: {
				expiresIn: 60 * 30,
			},
		}
	}

	constructor() {
		log.withDomain('success', 'AuthService', 'AuthService started!')

		return this;
	}

	 deny = () => {
		throw new GraphQLError('Invalid credentials', {
			extensions: {
				code: 'UNAUTHORIZED',
				http: { status: 401 },
			}
		});
	}

	// Session block

	handleSession = async (request) => {
		if (request.headers?.authorization) {
			const sessionId = request.headers.authorization.replace('Bearer ', '');
			const session = await this.getSession(sessionId);
			if (session?.userId !== null) {

			} else {
				return 'invalid';
			}

		} else return undefined;
	}

	createSession = async (userId, request, rId) => {
		return await new Session({userId, request}, rId).save(this.#config.auth.session.expiresIn, rId).catch(_ => false); // Catch internal errors, return false on fail
	}


	// Authentication code block

	generateCode = (rId) => {
		const length = this.#config.auth.code.length;

		if (length <= 0) {
			throw new InternalError("Auth length must be greater than 0! Cannot generate auth code.", undefined, 'AuthService', false, {requestId: rId});
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

	createCode = async (userId, userEmail, rId) => {
		return await new AuthCode({userId, userEmail}, rId).save(this.#config.auth.code.expiresIn, rId).catch(_ => false); // Catch internal errors, return false on fail
	}

	sendEmail = async () => {

	}

	checkCode = async (userId, code, rId) => {
		const node = await AuthCode.find(userId, code, rId);

		return (node?.code !== undefined && node?.code !== null) ? node : this.deny();
	}
}

export const service = new AuthService();