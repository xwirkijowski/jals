import EventEmitter from "events";
import { GraphQLError } from "graphql";

import {config} from "@config";
import {globalLogger as log} from '@util/logging/log';

import {AuthCodeManager, TAuthCodeManager} from "@service/auth/authCode.manager";
import {SessionManager, TSessionManager} from "@service/auth/session.manager";

import Session, {TSession} from "./session";
import {TAuthCodeInstance} from "./authCode";

// Types
import {ISession, TSettingsAuth} from "./types";
import {IContext, UContextSession} from "@type/context.types";
import {ERequestAuthCodeAction} from "@schema/@session/session.types";
import {TId} from "@type/id.types";

export class AuthService extends EventEmitter {
	private default_config: TSettingsAuth = {
		code: {
			length: 8,
			expiresIn: 60 * 5,
		},
		session: {
			expiresIn: 60 * 30,
		},
	}
	private authCodeManager: TAuthCodeManager;
	private sessionManager: TSessionManager;

	config: TSettingsAuth;

	constructor (config?: TSettingsAuth) {
		super();

		log.withDomain('log', 'AuthService', 'Loading AuthService configuration...');

		this.config = {...this.default_config, ...config} // @todo Deep join
		this.authCodeManager = new AuthCodeManager(this.config.code);
		this.sessionManager = new SessionManager(this.config.session);

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
	
	/**
	 * Session segment
	 */

	/**
	 * Authentication method, handles session on request
	 *
	 * @param request
	 * @param rId
	 */
	handleSession = async (request: IContext['req'], rId: string): Promise<UContextSession> => {
		if (request && request.headers.authorization) {
			const sessionId: string = request.headers.authorization.replace('Bearer ', '');
			const session: TSession|undefined = await Session.find(sessionId, rId);

			if (session) {
				await session.refresh(this.config.session.expiresIn, rId);

				return session;
			} else {
				// Session expired or header malformed
				return 'invalid';
			}
		} else return undefined;
	}

	createSession = async (
		userId: ISession["userId"],
		isAdmin: boolean,
		request: IContext['req'],
		response: IContext['res'],
		rId: string
	): Promise<TSession|false> => {
		// Catch internal errors, to avoid propagation to response
		const session: TSession|false = await new Session({userId, isAdmin}, rId, request)
			.save(this.config.session.expiresIn, rId)
			.catch((): false => false);

		// Return false on fail, handle in resolver
		if (!session) return false;

		return session;
	}

	getSessionById = async (sessionId: ISession['sessionId'], rId: string) => {
		if (!sessionId) return undefined; // Silent fail, variable should be checked beforehand
		return await Session.find(sessionId, rId);
	}

	getSessionsByUserId = async (userId: ISession['sessionId'], rId: string) => {
		if (!userId) return undefined; // Silent fail, variable should be checked beforehand
		return await Session.findByUserId(userId, rId);
	}
	
	/**
	 * AuthCode segment
	 */
	
	/**
	 *
	 * @param userId
	 * @param userEmail
	 * @param action
	 * @param rId
	 */
	requestCode = async (userId: TId|undefined, userEmail: string, action: ERequestAuthCodeAction, rId: TId): Promise<TAuthCodeInstance|undefined> => {
		return await this.authCodeManager.createNew(userId.toString(), userEmail, action, rId);
	}

	/**
	 * Check if supplied code exists.
	 *
	 * @param   userId  The user ID to check against
	 * @param   code    The authentication code string
	 * @param	action  Context of the authentication code
	 * @param   rId
	 *
	 * @return Promise<AuthCode>
	 * @return Promise<undefined>
	 */
	checkCode = async (userId: TId|undefined, code: string, action: ERequestAuthCodeAction, rId: TId): Promise<TAuthCodeInstance|undefined> => {
		return await this.authCodeManager.retrieve(userId.toString(), code, action, rId);
	}
}

export type TAuthService = InstanceType<typeof AuthService>;

export const $AuthService = new AuthService(config.settings.auth);