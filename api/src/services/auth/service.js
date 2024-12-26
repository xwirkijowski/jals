import {GraphQLError} from "graphql";

import crypto from 'node:crypto';

import { CriticalError } from './../../utilities/errors/index.js';
import { globalLogger as log } from '../../utilities/log.js';
export { log };

import Session from "./session.js";
import AuthCode from "./authCode.js";

export class AuthService {
	default_config = {
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

	config = {};

	constructor (config) {
		log.withDomain('info', 'AuthService', 'Loading AuthService configuration...');

		this.config = {...this.default_config, ...config}

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

	handleSession = async (request, rId) => {
		if (request.headers?.authorization) {
			const sessionId = request.headers.authorization.replace('Bearer ', '');
			const session = await Session.find(sessionId, rId);

			if (session) {
				await session.refresh(this.config.auth.session.expiresIn);

				return session;
			} else {
				// Session expired or header malformed
				return 'invalid';
			}
		} else return undefined;
	}

	createSession = async (userId, isAdmin, request, rId) => {
		return await new Session({userId, isAdmin, request}, rId).save(this.config.auth.session.expiresIn, rId).catch(_ => false); // Catch internal errors, return false on fail
	}


	// Authentication code block

	generateCode = (rId) => {
		const length = this.config.auth.code.length;

		if (length <= 0) {
			throw new CriticalError("Auth length must be greater than 0! Cannot generate auth code.", 'AUTH_CONFIG_FAULT', 'AuthService', true, {requestId: rId});
		}

		let code = '';
		while (code.length < length) {
			const byte = crypto.randomBytes(1)[0];

			if (byte < 250) {
				code += (byte % 10).toString();
			}
		}

		return code;
	}


	createCode = async (userId, userEmail, rId) => {
		return await new AuthCode({userId, userEmail}, rId, this.generateCode).save(this.config.auth.code.expiresIn, rId).catch(e => console.log('caught', e)); // Catch internal errors, return false on fail
	}

	sendEmail = async () => {

	}

	/**
	 * Check if supplied code exists.
	 *
	 * @param 	userId
	 * @param 	code
	 * @param 	rId
	 *
	 * @returns	{Promise<AuthCode|boolean>}	If AuthCode found, return AuthCode instance;
	 * 										If no AuthCode found, return false;
	 */
	checkCode = async (userId, code, rId) => {
		const node = await AuthCode.find(userId, code, rId);

		return (node?.code) ? node : false;
	}
}