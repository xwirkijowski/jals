import {EntityId} from "redis-om";

import { CriticalError } from '../../utilities/errors/index';
import { getIP } from "../../utilities/helpers";

import { repository as model } from "./session.model";
import { log } from "./service";

import {ISession} from "./types";
import {IncomingMessage} from "node:http";

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

	constructor(props: ISession, rId: string, request?: IncomingMessage) {
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

	static async find(sessionId: string, rId: string): Promise<TSession> {
		const node = await model.fetch(sessionId);

		node.sessionId = node[(EntityId as unknown as string)];

		return (node?.userId) ? new Session((node as ISession), rId) : undefined;
	}

	static async findByUserId(userId: ISession['userId'], rId: string): Promise<Array<TSession>> {
		const nodes = await model.search()
			.where('userId').equals(userId as string)
			.return.all();

		let sessions: Array<TSession> = [];

		if (nodes.length > 0) {
			nodes.forEach(node => {
				if (node?.userId === userId) {
					node.sessionId = node[(EntityId as unknown as string)];
					sessions.push(new Session((node as ISession), rId));
				}
			})
		}

		return sessions;
	}

	refresh = async (expiresIn: number, rId: string): Promise<this> => {
		if (!this.sessionId) return undefined;

		this.updatedAt = new Date();
		this.version++;

		// Save updated session and update TTL
		await model.save(this.sessionId, this)
		await model.expire(this.sessionId, expiresIn);

		return this;
	}

	save = async (expiresIn: number, rId: string): Promise<this> => {
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
export type TSession = InstanceType<typeof Session>;