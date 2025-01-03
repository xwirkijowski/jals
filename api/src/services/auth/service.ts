import { GraphQLError } from "graphql";
import crypto from 'node:crypto';

import { CriticalError } from '../../utilities/errors/index';
import { globalLogger as log } from '../../utilities/log';
export { log };

import Session from "./session";
import AuthCode from "./authCode";

// Types
import {IncomingMessage} from "node:http";
import {AuthServiceConfig, AuthCodeGenerator} from "./types";
import {ContextSessionUnion} from "../../types/context.types";

export class AuthService {
	default_config: AuthServiceConfig = {
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

	config: AuthServiceConfig;

	constructor (config?: AuthServiceConfig) {
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

	handleSession = async (request: IncomingMessage, rId: string): Promise<ContextSessionUnion> => {
		if (request && request.headers.authorization) {
			const sessionId: string = request.headers.authorization.replace('Bearer ', '');
			const session: Session|undefined = await Session.find(sessionId, rId);

			if (session) {
				await session.refresh(this.config.auth.session.expiresIn, rId);

				return session;
			} else {
				// Session expired or header malformed
				return 'invalid';
			}
		} else return undefined;
	}

	createSession = async (userId: string, isAdmin: boolean, request: IncomingMessage, rId: string) => {
		// Catch internal errors, return false on fail to avoid propagation to public API
		return await new Session({userId, isAdmin}, rId, request).save(this.config.auth.session.expiresIn, rId).catch((_: Error): boolean => false);
	}

	// Authentication code block

	generateCode: AuthCodeGenerator = (rId: string): string => {
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


	createCode = async (userId: string, userEmail: string, rId: string) => {
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
	 * @returns	{Promise<AuthCode|false>}	If AuthCode found, return AuthCode instance;
	 * 										If no AuthCode found, return false;
	 */
	checkCode = async (userId: string, code: string, rId: string): Promise<AuthCode|false> => {
		if (!userId || !code || !rId) {
			throw new CriticalError('Missing arguments, cannot check AuthCode', 'AUTH_CHECK_CODE_FAULT', 'AuthService', true, {userId, code, requestId: rId});
		}

		const node = await AuthCode.find(userId, code, rId);

		return (node?.code) ? node : false;
	}
}