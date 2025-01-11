import EventEmitter from "events";
import crypto from 'node:crypto';
import { GraphQLError } from "graphql";

import { CriticalError } from '../../utilities/errors/index';
import { globalLogger as log } from '../../utilities/logging/log';
export { log };

import Session, {SessionType} from "./session";
import AuthCode, {AuthCodeType} from "./authCode";

// Types
import {IncomingMessage} from "node:http";
import {AuthServiceConfig, AuthCodeGenerator, SessionInterface, AuthCodeInterface} from "./types";
import {ContextSessionUnion} from "../../types/context.types";
import {ERequestAuthCodeAction} from "../../schema/@session/session.mutations.types";

export class AuthService extends EventEmitter {
	default_config: AuthServiceConfig = {
		code: {
			length: 6,
			expiresIn: 60 * 5,
		},
		session: {
			expiresIn: 60 * 30,
		},
	}

	config: AuthServiceConfig;

	constructor (config?: AuthServiceConfig) {
		super();

		log.withDomain('log', 'AuthService', 'Loading AuthService configuration...');

		this.config = {...this.default_config, ...config} // @todo Deep join

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
			const session: SessionType|undefined = await Session.find(sessionId, rId);

			if (session) {
				await session.refresh(this.config.session.expiresIn, rId);

				return session;
			} else {
				// Session expired or header malformed
				return 'invalid';
			}
		} else return undefined;
	}

	createSession = async (userId: SessionInterface["userId"], isAdmin: boolean, request: IncomingMessage, rId: string) => {
		// Catch internal errors, return false on fail to avoid propagation to public API
		return await new Session({userId, isAdmin}, rId, request).save(this.config.session.expiresIn, rId).catch((_: Error): boolean => false);
	}

	// Authentication code block

	generateCode: AuthCodeGenerator = (rId: string): string => {
		const length = this.config.code.length;

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

	createCode = async (userId: AuthCodeInterface["userId"], userEmail: string, action: AuthCodeInterface["action"], rId: string) => {
		return await new AuthCode({userId, userEmail, action}, rId, this.generateCode).save(this.config.code.expiresIn, rId).catch(e => console.log('caught', e)); // Catch internal errors, return false on fail
	}

	/**
	 * Check if supplied code exists.
	 *
	 * @param   userId
	 * @param   code
	 * @param	action
	 * @param   rId
	 *
	 * @returns    {Promise<AuthCode|false>}    If AuthCode found, return AuthCode instance;
	 *                                        If no AuthCode found, return false;
	 */
	checkCode = async (userId: AuthCodeInterface["userId"], code: string, action: AuthCodeInterface["action"], rId: string): Promise<AuthCode|false> => {
		if ((action === ERequestAuthCodeAction['LOGIN'] && !userId) || !code || !rId) {
			throw new CriticalError('Missing arguments, cannot check AuthCode', 'AUTH_CHECK_CODE_FAULT', 'AuthService', true, {userId, code, action, requestId: rId});
		}

		const node: AuthCodeType|undefined = await AuthCode.find(userId, code, action, rId);

		return (node?.code) ? node : false;
	}
}

export type AuthServiceType = InstanceType<typeof AuthService>;