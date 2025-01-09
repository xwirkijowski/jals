import { EntityId } from "redis-om";

import {CriticalError, InternalError} from '../../utilities/errors/index';

import { repository as model } from "./authCode.model";
import { log } from "./service";

import {AuthCodeGenerator, AuthCodeInterface} from './types';
import {ERequestAuthCodeAction} from "../../schema/session/session.mutations.types";

export default class AuthCode {
	authCodeId?: string
	action?: string
	code?: string
	userId?: AuthCodeInterface["userId"]
	userEmail?: string
	createdAt?: string|Date

	constructor (props: AuthCodeInterface , rId?: string, generator?: AuthCodeGenerator) {
		if (props?.[EntityId] && props?.code) { // Create new instance from existing
			this.authCodeId = props[EntityId];
			this.action = props.action;
			this.code = props.code;
			this.userId = props.userId;
			this.userEmail = props.userEmail;
			this.createdAt = props.createdAt;
		} else { // New instance to insert
			if (!props) return this; // No properties to use, pass to `Find` existing code

			// @todo Change caller handling, no support for throw atm
			else if ((props?.action === 'LOGIN' && !props?.userId) || !props?.userEmail) {
				throw new CriticalError('Code creation failed, no userId and userEmail provided!', 'AUTHCODE_MISSING_ARGS', 'AuthService', true, {requestId: rId, ...props})
			} else if (!generator) {
				throw new CriticalError('No generator passed to AuthCode constructor', 'AUTHCODE_MISSING_ARGS', 'AuthService', true, {requestId: rId, ...props})
			}

			this.action = props.action;
			this.userId = props?.userId?.toString();
			this.userEmail = props.userEmail.toString();
			this.code = generator((rId as string));
		}

		return this;
	}

	static async find (userId: AuthCodeInterface["userId"], code: string, action: ERequestAuthCodeAction, rId: string): Promise<AuthCodeType> {
		let node;

		if (action === ERequestAuthCodeAction['LOGIN']) {
			node = model.search()
				.where('userId').equals(userId as string)
				.and('code').equals(code)
				.and('action').equals(action)
				.return.first();
		}
		else {
			node = model.search()
				.where('code').equals(code)
				.and('action').equals(action)
				.return.first();
		}

		return (node?.code) ? new AuthCode((node as AuthCodeInterface)) : undefined;
	}

	save = async (expiresIn: number, rId: string): Promise<this> => {
		if (this.authCodeId) throw new InternalError('Cannot save existing AuthCode', 'AUTHCODE_SAVE_EXISTS', 'AuthService', true, {requestId: rId, authCode: this});

		this.createdAt = new Date().toISOString(); // Set close to insertion

		const node = await model.save(this);

		if (node.code) {
			this.authCodeId = node[(EntityId as unknown as string)];

			await model.expire(node[(EntityId as unknown as string)], expiresIn);

			log.withDomain('audit', 'AuthService', "Authentication code created", {userId: this.userId, authCodeId: this.authCodeId, requestId: rId});

			return this;
		} else {
			throw new CriticalError('AuthCode save failed!', 'AUTHCODE_SAVE_FAULT', 'AuthService', true, {requestId: rId, authCode: this})
		}
	}
}

// Export class type
export type AuthCodeType = InstanceType<typeof AuthCode>;