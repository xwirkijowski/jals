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
	
	domain: string = "AuthService->Code"

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
			// New instance to create entity
			
			if ((props?.action === 'LOGIN' && !props?.userId) || !props?.userEmail) {
				throw new CriticalError('Code creation failed, no userId and userEmail provided!', 'AUTHCODE_MISSING_ARGS', this.domain, true, {requestId: rId, ...props})
			} else if (!generator) {
				throw new CriticalError('No generator passed to AuthCode constructor', 'AUTHCODE_MISSING_ARGS', this.domain, true, {requestId: rId, ...props})
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
	 * @since 2.1.1
	 * @static
	 * @async
	 *
	 * @throws  InternalError   Missing parameters, cannot search
	 * @param   userId  The ID of the user for which the code is to be created, undefined if used for registration
	 * @param   code    Authentication code string
	 * @param   action  Context in which the code will be used
	 * @param   rId     The unique request ID
	 * @return  Promise<TAuthCodeInstance>
	 */
	static async find (userId: TAuthCode["userId"], code: string, action: ERequestAuthCodeAction = ERequestAuthCodeAction.LOGIN, rId: TId): Promise<TAuthCodeInstance> {
		if ((action === ERequestAuthCodeAction['LOGIN'] && !userId) || !code || !action) throw new InternalError('Cannot search without required parameters', 'AUTHCODE_FIND_MISSING_ARGS', "AuthService->Code", true, {requestId: rId})

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

		return (this.isValid(node)) ? new AuthCode(node) : undefined;
	}
	
	/**
	 * Save AuthCode instance as an entity.
	 * Puts the instance into the database.
	 *
	 * @since 2.1.1
	 * @async
	 *
	 * @throws  InternalError   Cannot save, instance already exists as an entity
	 * @throws  CriticalError   Saving failed for unknown reasons
	 * @param   expiresIn   AuthCode max age
	 * @param   rId         The unique request ID
	 * @return  Promise<AuthCodeInstance>
	 */
	async save (expiresIn: number, rId: TId): Promise<this> {
		if (this.authCodeId) throw new InternalError('Cannot save existing AuthCode', 'AUTHCODE_SAVE_EXISTS', this.domain, true, {requestId: rId});

		this.createdAt = new Date().toISOString();

		const node: IAuthCodeEntity = await model.save(this as TAuthCode);

		if (node.code) {
			this.authCodeId = node[EntityId];

			await model.expire(node[EntityId], expiresIn);

			log.withDomain('audit', this.domain, "Authentication code created", {requestId: rId});

			return this;
		} else {
			throw new CriticalError('AuthCode save failed!', 'AUTHCODE_SAVE_FAULT', this.domain, true, {requestId: rId});
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
		const node = await model.fetch(authCodeId as string);
		
		if (report && node?.code) new CriticalError('AuthCode removal failed!', 'AUTHCODE_REMOVE_FAULT', "AuthService->Code", true, {requestId: rId});
		
		return this.isValid(node)
	}
	
	/**
	 * Removes an AuthCode entity from repository
	 *
	 * @since 2.1.1
	 * @static
	 * @async
	 *
	 * @throws  CriticalError   Missing parameters, cannot remove without identifier
	 * @param   authCodeId  AuthCode identifier
	 * @param   rId         The unique request ID
	 * @return  Promise<boolean>    Was AuthCode removed successfully?
	 */
	static async remove (authCodeId: TAuthCode['authCodeId'], rId: TId): Promise<boolean> {
		if (!authCodeId) throw new CriticalError('Cannot remove AuthCode without identifier', 'AUTHCODE_REMOVE_NO_ID', "AuthService->Code", true, {requestId: rId, authCode: this});
		
		await model.remove(authCodeId as string);

		return (await AuthCode.checkExists(authCodeId, true,  rId) === false)
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
		if (!this.authCodeId) throw new CriticalError('Cannot remove AuthCode without identifier', 'AUTHCODE_REMOVE_NO_ID', this.domain, true, {requestId: rId, authCode: this});
		
		await model.remove(this.authCodeId as string);
		
		return (await AuthCode.checkExists(this.authCodeId, true, rId) === false)
	}
}

export type TAuthCodeInstance = InstanceType<typeof AuthCode>;