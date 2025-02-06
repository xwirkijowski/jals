import EventEmitter from "events";

import {config} from "@config";
import {globalLogger as log} from '@util/logging/log';

import {$AuthCodeManager, TAuthCodeManager} from "@service/auth/authCode.manager";
import {$SessionManager, TSessionManager} from "@service/auth/session.manager";

// Types
import {IContext, UContextSession} from "@type/context.types";
import {TId} from "@type/id.types";
import {TSettingsAuth} from "./types";
import {ERequestAuthCodeAction} from "@schema/@session/session.types";
import {TSessionInstance} from "./session";
import {TAuthCodeInstance} from "./authCode";

// @todo Evaluate possibility of replacing with object ot managers.

export class AuthService extends EventEmitter {
	private authCodeManager: TAuthCodeManager;
	private sessionManager: TSessionManager;
	
	static domain: string = "AuthService";
	
	config: TSettingsAuth;

	constructor () {
		super();
		
		log.withDomain('log', AuthService.domain, 'Initializing AuthService')
		
		this.authCodeManager = $AuthCodeManager;
		this.sessionManager = $SessionManager;
		
		log.withDomain('success', AuthService.domain, 'AuthService started!')
		
		return this;
	}
	
	/**
	 * Session segment
	 */
	
	/**
	 * Resolves session from authorization headers and refreshes it.
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @param   request Request received by the server
	 * @param   rId     Unique request ID
	 * @return  Promise<UContextSession>
	 */
	async handleSession (request: IContext['req'], rId: TId): Promise<UContextSession> {
		return this.sessionManager.handle(request, rId);
	}
	
	/**
	 * Creates a new Session instance
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId      The ID of the user for which the session is to be created
	 * @param   isAdmin     Is user an admin
	 * @param   request     Request received by the server
	 * @param   rId         Unique request ID
	 * @returns Promise<TSessionInstance|undefined>
	 */
	async createSession (userId: TId, isAdmin: boolean, request: IContext['req'], rId: string): Promise<TSessionInstance|undefined> {
		return await this.sessionManager.createNew(userId, isAdmin, request, rId);
	}
	
	/**
	 * Attempts to find a session matching supplies session ID
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @param   sessionId   The ID of the session to fetch
	 * @param   rId         Unique request ID
	 * @return  Promise<TSessionInstance|undefined>
	 */
	async retrieveSession (sessionId: TId, rId: TId): Promise<TSessionInstance|undefined> {
		return await this.sessionManager.retrieve(sessionId, rId);
	}
	
	/**
	 * Attempts to find all sessions matching supplied user ID
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @param   userId  The ID of the user to filter for
	 * @param   rId     Unique request ID
	 * @return  Promise<TSessionInstance[]|undefined>
	 */
	async retrieveSessionByUserId (userId: TId, rId: TId): Promise<TSessionInstance[]|undefined> {
		return await this.sessionManager.retrieveByUserId(userId, rId);
	}
	
	/**
	 * Invalidates (removes) a Session entity from the database.
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   node    The Session instance
	 * @param   rId     Unique request ID
	 * @return  Promise<boolean>    Was Session removed successfully?
	 */
	async invalidateSession (node: TSessionInstance|undefined = undefined, rId: TId): Promise<boolean> {
		return await this.sessionManager.remove(node, rId);
	}
	
	/**
	 * Invalidates (removes) all Session entities for a specified userId from the database.
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId  The ID of the user to filter for
	 * @param   rId     Unique request ID
	 * @return  Promise<number|boolean>    Deleted sessions count or false if failed
	 */
	async invalidateAllSessions (userId: TId, rId: TId): Promise<number|boolean> {
		return await this.sessionManager.removeByUserId(userId, rId);
	}
	
	/**
	 * AuthCode segment
	 */
	
	/**
	 * Creates a new AuthCode instance
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId      The ID of the user for which the code is to be created, undefined if used for registration
	 * @param   userEmail   Email address of the user for which the code is to be created
	 * @param   action      Context in which the code will be used
	 * @param   rId         Unique request ID
	 * @return  Promise<TAuthCodeInstance|undefined>
	 */
	async requestCode (userId: TId|undefined, userEmail: string, action: ERequestAuthCodeAction, rId: TId): Promise<TAuthCodeInstance|undefined> {
		return await this.authCodeManager.createNew(userId, userEmail, action, rId);
	}

	/**
	 * Check if supplied code exists.
	 * In registration context, only code and action is used to find the AuthCode.
	 *
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId  The ID of the user for which the code is to be created, undefined if used for registration
	 * @param   code    The authentication code string
	 * @param   magic   The magic string used for link authentication
	 * @param	action  Context of the authentication code
	 * @param   rId     Unique request ID
	 * @return  Promise<TAuthCodeInstance|undefined>
	 */
	async checkCode (
		userId: TId|undefined,
		code: string|undefined = undefined,
		magic: string|undefined = undefined,
		action: ERequestAuthCodeAction,
		rId: TId
	): Promise<TAuthCodeInstance|undefined> {
		if (magic) {
			return await this.authCodeManager.retrieveByMagic(magic, action, rId);
		} else {
			return await this.authCodeManager.retrieve(userId, code, action, rId);
		}
	}
	
	/**
	 * Invalidates (removes) an AuthCode entity from the database.
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   node  The AuthCode instance
	 * @param   rId   Unique request ID
	 * @return  Promise<boolean>    Was AuthCode removed successfully?
	 */
	async invalidateCode (node: TAuthCodeInstance, rId: TId): Promise<boolean> {
		return await this.authCodeManager.remove(node, rId)
	}
}

export type TAuthService = InstanceType<typeof AuthService>;

export const $AuthService = new AuthService();