import {EntityId} from "redis-om";

import {CriticalError, InternalError} from '@util/error';
import {getIP, getUA} from "@util/helpers";

import { repository as model } from "./session.model";

import {ISession, ISessionEntity, TSession} from "./types";
import {IContext} from "@type/context.types";
import {TId} from "@type/id.types";

/**
 * @todo Implement check for expires
 */

export default class Session {
	sessionId?: string;
	userId: ISession["userId"];
	isAdmin: boolean = false;
	userAgent?: string;
	userAddr?: string;
	createdAt?: Date|string;
	updatedAt?: Date|string;
	version: number = 0;
	
	static domain: string = "AuthService->Code"
	
	/**
	 * Session constructor
	 *
	 * @since 2.0.0
	 *
	 * @throws  CriticalError   Cannot create Session, missing props (userId)
	 * @param   props   The data for the session to be built from
	 * @param   request Request received by the server, used to extract user-agent and address
	 * @param   rId     Unique request ID
	 * @return  TSessionInstance
	 */
	constructor(props: ISession, request: IContext['req'] = undefined, rId: TId) {
		if (!props?.userId) {
			throw new CriticalError('Session creation failed, no userId provided!', 'SESSION_MISSING_ARGS', Session.domain, true, {requestId: rId})
		}

		this.sessionId = props?.sessionId; // Assigned only when creating instance from existing entity
		this.userId = props.userId.toString();
		this.isAdmin = Boolean(props?.isAdmin) || false;
		this.userAgent = props?.userAgent?.toString() || request && getUA(request)?.toString() || undefined;
		this.userAddr = props?.userAddr?.toString() || request && getIP(request)?.toString() || undefined;
		this.createdAt = props?.createdAt ? new Date(props.createdAt) : undefined;
		this.updatedAt = props?.updatedAt ? new Date(props.updatedAt) : undefined;
		this.version = Number(props?.version) || 0;

		return this;
	}
	
	/**
	 * Retrieve a Session entity that matches the parameters.
	 *
	 * @since 2.0.0
	 * @static
	 * @async
	 *
	 * @throws  InternalError   Missing parameters, cannot search
	 * @param   sessionId   The ID of the session to fetch
	 * @param   rId         Unique request ID
	 * @return  Promise<TSessionInstance|undefined>
	 */
	static async find(sessionId: TSession['sessionId'], rId: TId): Promise<TSessionInstance|undefined> {
		if (!sessionId) throw new InternalError('Cannot search without required parameters', 'SESSION_FIND_MISSING_ARGS', Session.domain, true, {requestId: rId});
		
		const node: ISessionEntity = await model.fetch(sessionId);

		node.sessionId = node[EntityId];

		return (this.isValid(node)) ? new Session(node, undefined, rId) : undefined;
	}
	
	/**
	 * Retrieve a Session entity that matches the parameters.
	 *
	 * @since 2.0.0
	 * @static
	 * @async
	 *
	 * @throws  InternalError   Missing parameters, cannot search
	 * @param   userId  The ID of the user to filter for
	 * @param   rId     Unique request ID
	 * @return  Promise<TSessionInstance[]|undefined>
	 */
	static async findByUserId(userId: TSession['userId'], rId: TId): Promise<TSessionInstance[]|undefined> {
		if (!userId) throw new InternalError('Cannot search without required parameters', 'SESSION_FINDMANY_MISSING_ARGS', Session.domain, true, {requestId: rId});
		
		const nodes: Array<ISessionEntity> = await model.search()
			.where('userId').equals(userId)
			.return.all();

		let sessions: TSessionInstance[] = [];

		if (nodes.length > 0) {
			nodes.forEach((node: ISessionEntity) => {
				if (node?.userId === userId) {
					node.sessionId = node[EntityId];
					sessions.push(new Session(node, undefined, rId));
				}
			})
			
			return sessions;
		} else {return undefined}
	}
	
	/**
	 * Save Session instance as an entity.
	 * Puts the instance into the database.
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @throws  InternalError   Cannot save, instance already exists as an entity
	 * @throws  CriticalError   Saving failed for unknown reasons
	 * @param   expiresIn   Session max age
	 * @param   rId         Unique request ID
	 * @return  Promise<TSessionInstance>
	 */
	async save (expiresIn: number, rId: TId): Promise<this> {
		if (this.sessionId) throw new InternalError('Cannot save existing Session', 'SESSION_SAVE_EXISTS', Session.domain, true, {requestId: rId});

		this.createdAt = new Date().toISOString()

		const node: ISessionEntity = await model.save(this as TSession);
		
		if (Session.isValid(node)) {
			this.sessionId = node[EntityId];

			await model.expire(this.sessionId, expiresIn);

			return this;
		} else {
			throw new CriticalError("Session save failed!", 'SESSION_SAVE_FAULT', Session.domain, true, {requestId: rId});
		}
	}
	
	/**
	 * Updates the Session instance and entity.
	 * Changes the `updatedAt` and `version` field, updates max age.
	 *
	 * @since 2.0.0
	 * @async
	 *
	 * @param   expiresIn   Session max age
	 * @param   rId         Unique request ID
	 * @return  Promise<TSessionInstance>
	 */
	refresh = async (expiresIn: number, rId: TId): Promise<this> => {
		if (!this.sessionId) return undefined;

		this.updatedAt = new Date();
		this.version++;
		
		await model.save(this.sessionId, this as TSession)
		await model.expire(this.sessionId, expiresIn);

		return this;
	}
	
	/**
	 * Checks if the entity is valid, i.e. is not null
	 *
	 * @since 2.1.1
	 * @private
	 * @static
	 *
	 * @param   node    The Session entity
	 * @return  boolean
	 */
	private static isValid (node: ISession): boolean {
		return !!(node?.userId)
	}
	
	/**
	 * Checks if the entity was successfully removed from the database
	 *
	 * @since 2.1.1
	 * @private
	 * @static
	 * @async
	 *
	 * @param   sessionId   Session identifier
	 * @param   report      If true, will create (not throw) CriticalError for failed entity removal
	 * @param   rId         Unique request ID
	 * @return  Promise<boolean>    Does entity exist?
	 */
	private static async checkExists (sessionId: TSession['sessionId'], report: boolean = true, rId: TId): Promise<boolean> {
		const node: ISessionEntity = await model.fetch(sessionId as string);
		
		if (report && Session.isValid(node)) new CriticalError('Session removal failed!', 'SESSION_REMOVE_FAULT', Session.domain, true, {requestId: rId});
		
		return Session.isValid(node)
	}
	
	/**
	 * Removes a Session entity from repository
	 *
	 * @since 2.0.0
	 * @static
	 * @async
	 *
	 * @throws  CriticalError   Missing parameters, cannot remove without identifier
	 * @param   sessionId   Session identifier
	 * @param   rId         Unique request ID
	 * @return  Promise<boolean>    Was Session removed successfully?
	 */
	static async remove (sessionId: TSession['sessionId'], rId: TId): Promise<boolean> {
		if (!sessionId) throw new CriticalError('Cannot remove Session without identifier', 'SESSION_REMOVE_NO_ID', Session.domain, true, {requestId: rId});
		
		await model.remove(sessionId);
		
		return (await Session.checkExists(sessionId, true, rId) === false)
	}
	
	/**
	 * Removes multiple Session entities from repository
	 *
	 * @since 2.1.1
	 * @static
	 * @async
	 *
	 * @throws  CriticalError   Missing parameters, cannot remove without identifier
	 * @param   sessionIds  Session identifiers
	 * @param   rId         Unique request ID
	 * @return  Promise<boolean>    Was Session removed successfully?
	 */
	static async removeMany (sessionIds: TSession['sessionId'][], rId: TId): Promise<boolean> {
		if (!sessionIds || sessionIds.length === 0) throw new CriticalError('Cannot remove Session without identifiers', 'SESSION_REMOVEMANY_NO_ID', Session.domain, true, {requestId: rId});
		
		await model.remove(sessionIds);
		
		const checks: Promise<boolean>[] = sessionIds.map((sessionId: string) => Session.checkExists(sessionId, true, rId));
		const results: boolean[] = await Promise.all(checks);
		
		return results.every((exists: boolean) => !exists);
	}
	
	/**
	 * Removes a Session entity from repository
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @throws  CriticalError   Malformed or not saved instance used, cannot remove without identifier
	 * @param   rId     TUnique request ID
	 * @return  Promise<boolean>    Was Session removed successfully?
	 */
	remove = async (rId: TId): Promise<boolean> => {
		if (!this.sessionId) throw new CriticalError('Cannot remove AuthCode without identifier', 'SESSION_REMOVE_NO_ID', Session.domain, true, {requestId: rId});
		
		await model.remove(this.sessionId);

		return (await Session.checkExists(this.sessionId, true, rId) === false)
	}
}

// Export class type
export type TSessionInstance = InstanceType<typeof Session>;