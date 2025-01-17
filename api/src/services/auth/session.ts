import {EntityId} from "redis-om";

import { CriticalError } from '../../utilities/errors/index';
import { getIP } from "../../utilities/helpers";

import { repository as model } from "./session.model";
import { log } from "./service";

import {SessionInterface} from "./types";
import {IncomingMessage} from "node:http";

/**
 * @todo Implement check for expires
 */

export default class Session {
	sessionId?: string;
	userId: SessionInterface["userId"];
	isAdmin: boolean = false;
	userAgent?: string;
	userAddr?: string;
	createdAt?: Date|string;
	updatedAt?: Date|string;
	version: number = 0;

	constructor(props: SessionInterface, rId: string, request?: IncomingMessage) {
		if (!props?.userId) { // @todo Change caller handling, no support for throw atm
			throw new CriticalError('Session creation failed, no userId provided!', 'SESSION_MISSING_ARGS', 'AuthService', true, {requestId: rId, ...props})
		}

		this.sessionId = props?.sessionId;
		this.userId = props.userId.toString();
		this.isAdmin = Boolean(props?.isAdmin)||false;
		this.userAgent = props?.userAgent?.toString() || request?.headers?.['user-agent'] || undefined;
		this.userAddr = props?.userAddr?.toString() || request && getIP(request)?.toString() || undefined;
		this.createdAt = props?.createdAt ? new Date(props.createdAt) : undefined;
		this.updatedAt = props?.updatedAt ? new Date(props.updatedAt) : undefined;
		this.version = props?.version || 0;

		return this;
	}

	static async find(sessionId: string, rId: string) {
		const node = await model.fetch(sessionId);

		node.sessionId = node[(EntityId as unknown as string)];

		return (node?.userId) ? new Session((node as SessionInterface), rId) : undefined;
	}

	refresh = async (expiresIn: number, rId: string) => {
		if (!this.sessionId) return undefined;

		this.updatedAt = new Date();
		this.version++;

		// Save updated session and update TTL
		await model.save(this.sessionId, this)
		await model.expire(this.sessionId, expiresIn);

		return this;
	}

	save = async (expiresIn: number, rId: string) => {
		if (this.sessionId) return undefined;

		this.createdAt = new Date().toISOString(); // Set close to insertion

		const node = await model.save(this);

		if (node.userId) {
			this.sessionId = node[(EntityId as unknown as string)];

			await model.expire((this.sessionId as string), expiresIn);

			log.withDomain('audit', 'AuthService', "Session created", {userId: this.userId, sessionId: this.sessionId, requestId: rId});

			return this;
		} else {
			new CriticalError("Session save failed!", 'SESSION_SAVE_FAULT', 'AuthService', true, {requestId: rId, session: this});
			return undefined;
		}
	}
}

// Export class type
export type SessionType = InstanceType<typeof Session>;