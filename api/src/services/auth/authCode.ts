import { EntityId } from "redis-om";

import {CriticalError, InternalError} from '@util/error';
import {globalLogger as log} from '@util/logging/log';
import { repository as model } from "./authCode.model";

// Types
import {IAuthCodeGenerator, IAuthCode, IAuthCodeEntity, TAuthCode} from './types';
import {ERequestAuthCodeAction} from "@schema/@session/session.types";
import {TId} from "@type/id.types";

export default class AuthCode {
	authCodeId?: IAuthCode["authCodeId"]
	userId?: IAuthCode["userId"]
	userEmail: IAuthCode["userEmail"]
	code?: IAuthCode["code"]
	action: IAuthCode["action"]
	createdAt?: IAuthCode["createdAt"]
	
	static domain: string = "AuthService->Code"
	
	/**
	 * AuthCode constructor
	 *
	 * @since 2.0.0
	 *
	 * @throws  CriticalError   Cannot create AuthCode, missing props (userId or/and userEmail)
	 * @throws  CriticalError   No authentication code generator passed, cannot generate code string
	 * @param   props   The data for the AuthCode to be built from
	 * @param   rId     Unique request ID
	 * @param   generator   Authentication code generator function passed from manager
	 * @return  TAuthCodeInstance
	 */
	constructor (props: TAuthCode, rId?: TId, generator?: IAuthCodeGenerator) {
		if (props?.[EntityId] && props?.code) {
			// Create new instance from existing entity

			this.authCodeId = props[EntityId];
			this.action = props.action;
			this.code = props.code;
			this.userId = props.userId;
			this.userEmail = props.userEmail;
			this.createdAt = props.createdAt;
		} else {
			// Create new entity
			
			if ((props?.action === 'LOGIN' && !props?.userId) || !props?.userEmail) {
				throw new CriticalError('Code creation failed, no userId and userEmail provided!', 'AUTHCODE_MISSING_ARGS', AuthCode.domain, true, {requestId: rId})
			} else if (!generator) {
				throw new CriticalError('No generator passed to AuthCode constructor', 'AUTHCODE_MISSING_ARGS', AuthCode.domain, true, {requestId: rId})
			}

			this.action = props.action;
			this.userId = props?.userId?.toString();
			this.userEmail = props.userEmail.toString();
			this.code = generator(rId);
		}

		return this;
	}
	
	/**
	 * Retrieve an AuthCode entity that matches the parameters.
	 * Changes query based on action.
	 *
	 * @since 2.0.0
	 * @static
	 * @async
	 *
	 * @throws  InternalError   Missing parameters, cannot search
	 * @param   userId  The ID of the user to filter for
	 * @param   code    Authentication code string
	 * @param   action  Context in which the code will be used
	 * @param   rId     The unique request ID
	 * @return  Promise<TAuthCodeInstance|undefined>
	 */
	static async find (userId: TAuthCode["userId"], code: string, action: ERequestAuthCodeAction = ERequestAuthCodeAction.LOGIN, rId: TId): Promise<TAuthCodeInstance|undefined> {
		if ((action === ERequestAuthCodeAction['LOGIN'] && !userId) || !code || !action) throw new InternalError('Cannot search without required parameters', 'AUTHCODE_FIND_MISSING_ARGS', AuthCode.domain, true, {requestId: rId})

		const node: IAuthCode = (action === ERequestAuthCodeAction['LOGIN'])
			? await model.search()
				.where('userId').equals(userId)
				.and('code').equals(code)
				.and('action').equals(action)
				.return.first()
			: await model.search()
				.where('code').equals(code)
				.and('action').equals(action)
				.return.first();
		
		node.authCodeId = node[EntityId];
		
		return (AuthCode.isValid(node)) ? new AuthCode(node, rId) : undefined;
	}
	
	/**
	 * Save AuthCode instance as an entity.
	 * Puts the instance into the database.
	 *
	 * @since 2.0.0
	 * @async
	 *
	 * @throws  InternalError   Cannot save, instance already exists as an entity
	 * @throws  CriticalError   Saving failed for unknown reasons
	 * @param   expiresIn   AuthCode max age
	 * @param   rId         The unique request ID
	 * @return  Promise<TAuthCodeInstance>
	 */
	async save (expiresIn: number, rId: TId): Promise<this> {
		if (this.authCodeId) throw new InternalError('Cannot save existing AuthCode', 'AUTHCODE_SAVE_EXISTS', AuthCode.domain, true, {requestId: rId});

		this.createdAt = new Date().toISOString();

		const node: IAuthCodeEntity = await model.save(this as TAuthCode);

		if (AuthCode.isValid(node)) {
			this.authCodeId = node[EntityId];

			await model.expire(this.authCodeId, expiresIn);

			log.withDomain('audit', AuthCode.domain, "Authentication code created", {requestId: rId});

			return this;
		} else {
			throw new CriticalError('AuthCode save failed!', 'AUTHCODE_SAVE_FAULT', AuthCode.domain, true, {requestId: rId});
		}
	}
	
	/**
	 * Checks if the entity is valid, i.e. is not null
	 *
	 * @since 2.1.1
	 * @private
	 * @static
	 *
	 * @param   node    The AuthCode entity
	 * @return  boolean
	 */
	private static isValid (node: IAuthCode): boolean {
		return !!(node?.code)
	}
	
	/**
	 * Checks if the entity was successfully removed from the database
	 *
	 * @since 2.1.1
	 * @private
	 * @static
	 * @async
	 *
	 * @param   authCodeId  AuthCode identifier
	 * @param   report      If true, will create (not throw) CriticalError for failed entity removal
	 * @param   rId         The unique request ID
	 * @return  Promise<boolean>    Does entity exist?
	 */
	private static async checkExists (authCodeId: TAuthCode['authCodeId'], report: boolean = true, rId: TId): Promise<boolean> {
		const node: IAuthCodeEntity = await model.fetch(authCodeId as string);
		
		if (report && AuthCode.isValid(node)) new CriticalError('AuthCode removal failed!', 'AUTHCODE_REMOVE_FAULT', AuthCode.domain, true, {requestId: rId});
		
		return AuthCode.isValid(node)
	}
	
	/**
	 * Removes an AuthCode entity from repository
	 *
	 * @since 2.0.0
	 * @static
	 * @async
	 *
	 * @throws  CriticalError   Missing parameters, cannot remove without identifier
	 * @param   authCodeId  AuthCode identifier
	 * @param   rId         The unique request ID
	 * @return  Promise<boolean>    Was AuthCode removed successfully?
	 */
	static async remove (authCodeId: TAuthCode['authCodeId'], rId: TId): Promise<boolean> {
		if (!authCodeId) throw new CriticalError('Cannot remove AuthCode without identifier', 'AUTHCODE_REMOVE_NO_ID', AuthCode.domain, true, {requestId: rId, authCode: this});
		
		await model.remove(authCodeId);

		return (await AuthCode.checkExists(authCodeId, true, rId) === false)
	}
	
	/**
	 * Removes an AuthCode entity from repository
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @throws  CriticalError   Malformed or not saved instance used, cannot remove without identifier
	 * @param   rId     The unique request ID
	 * @return  Promise<boolean>    Was AuthCode removed successfully?
	 */
	async remove (rId: TId): Promise<boolean> {
		if (!this.authCodeId) throw new CriticalError('Cannot remove AuthCode without identifier', 'AUTHCODE_REMOVE_NO_ID', AuthCode.domain, true, {requestId: rId, authCode: this});
		
		await model.remove(this.authCodeId);
		
		return (await AuthCode.checkExists(this.authCodeId, true, rId) === false)
	}
}

export type TAuthCodeInstance = InstanceType<typeof AuthCode>;