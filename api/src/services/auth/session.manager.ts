
import {config} from "@config";
import {globalLogger as log} from "@util/logging/log";

import {ErrorAggregator, CriticalError} from "@util/error";
import Session, {TSessionInstance} from "@service/auth/session";
import {Manager} from "@service/auth/manager";

// Types
import {IContext, UContextSession} from "@type/context.types";
import {TId} from "@type/id.types";
import {TSettingsAuth} from "@service/auth/types";

/**
 * Authentication code manager
 *
 * Every method that calls other classes is enclosed in a `try...catch` to stop propagation to API response.
 *
 * @since 2.1.1
 */
class SessionManager extends Manager {
	config: TSettingsAuth["session"];
	
	static domain: string = "AuthService->Session";
	domain: string = SessionManager.domain;
	
	/**
	 * Construct a new manager instance
	 *
	 * @since 2.1.1
	 *
	 * @param   config          Config, options from the `settings.json` file.
	 * @return  TSessionManager
	 */
	constructor (config: TSettingsAuth["session"]) {
		super();
		
		this.config = config;
		this.errors = new ErrorAggregator(SessionManager.domain);
		
		log.withDomain('log', SessionManager.domain, 'Session manager initialized')
		
		return this;
	}
	
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
	async handle (request: IContext['req'], rId: TId): Promise<UContextSession> {
		if (request && request.headers.authorization) {
			const sessionId: string = request.headers.authorization.replace('Bearer ', '');
			
			let session: TSessionInstance|undefined
			try {
				session = await Session.find(sessionId, rId);
			} catch (e) {return undefined}
			
			if (session) {
				try {
					await session.refresh(this.config.expiresIn, rId);
				} catch (e) {return undefined}
				
				return session;
			} else { return 'invalid'; }
		} else return undefined;
	}
	
	/**
	 * Creates a new Session instance
	 *
	 * Creates (not throws) error if missing required parameters.
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId      The ID of the user for which the session is to be created
	 * @param   isAdmin     Is user an admin
	 * @param   request     Request received by the server, used to extract user-agent and address
	 * @param   rId         Unique request ID
	 * @return  Promise<TSessionInstance|undefined>
	 */
	async createNew (userId: TId, isAdmin: boolean = false, request: IContext['req'], rId: TId): Promise<TSessionInstance|undefined> {
		if (!userId) {
			this.processError(new CriticalError('Cannot create session, missing props!', 'SESSION_CREATE_MISSING_ARGS', Session.domain, true, {requestId: rId}));
			return undefined;
		}
		
		try {
			const node: TSessionInstance = await new Session({userId: userId.toString(), isAdmin}, request, rId).save(this.config.expiresIn, rId);
			this.emit('created', {sessionId: node.sessionId, rId});
			
			return node;
		} catch (e) {
			this.processError(e);
			return undefined;
		}
	}
	
	/**
	 * Attempts to find a session matching supplies session ID
	 *
	 * @since 2.0.0
	 * @async
	 *
	 * @param   sessionId   The ID of the session to fetch
	 * @param   rId         Unique request ID
	 * @return  Promise<TSessionInstance|undefined>
	 */
	async retrieve (sessionId: TId, rId: TId): Promise<TSessionInstance|undefined> {
		if (!sessionId) {
			this.processError(new CriticalError('Missing arguments, cannot search for Session!', 'SESSION_RETREIVE_MISSING_ARGS', Session.domain, true, {requestId: rId}));
			return undefined;
		}
		
		try {
			return await Session.find(sessionId.toString(), rId);
		} catch (e) {
			this.processError(e);
			return undefined;
		}
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
	async retrieveByUserId (userId: TId, rId: TId): Promise<TSessionInstance[]|undefined> {
		if (!userId) {
			this.processError(new CriticalError('Missing arguments, cannot search for Session!', 'SESSION_RETREIVEMANY_MISSING_ARGS', Session.domain, true, {requestId: rId}));
			return undefined;
		}
		
		try {
			return await Session.findByUserId(userId.toString(), rId);
		} catch (e) {
			this.processError(e);
			return undefined;
		}
	}
	
	/**
	 * Remove a session from the database
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   node    The Session instance
	 * @param   rId     Unique request ID
	 * @return  Promise<boolean>    Was Session removed successfully?
	 */
	async remove (node: TSessionInstance|undefined, rId: TId): Promise<boolean> {
		try {
			return await node.remove(rId);
		} catch (e) {
			this.processError(e);
			return false;
		}
	}
}

export type TSessionManager = InstanceType<typeof SessionManager>;

export const $SessionManager = new SessionManager(config.settings.auth.session);

$SessionManager.on('created', ({sessionId, rId: requestId}) => log.withDomain('audit', SessionManager.domain, 'Session created', {sessionId, requestId}))