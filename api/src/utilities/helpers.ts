import mongoose from 'mongoose';
import { GraphQLError } from "graphql";

import {IncomingMessage} from "node:http";
import { $DB } from "./database/status";
import {SessionType} from "../services/auth/session";
import {ContextInterface} from "../types/context.types";
import {IdType} from "../types/id.types";
import {CriticalError} from "./errors";

export const h = {
	/**
	 * Prepares basic pagination information needed for
	 * database queries
	 *
	 * @todo Types
	 *
	 * @param 	args		object	Arguments from the GraphQL query.
	 * @param 	pagination	object	GraphQL shared query context pagination field.
	 *
	 * @returns	{{
	 * 		perPage: number,
	 * 		page: number,
	 * 		skip: number
	 * }}					object	Basic pagination data user for queries.
	 */
	prepPagination: (args: any, pagination: any): {
        perPage: number;
        page: number;
        skip: number;
    } => {
		return {
			perPage: (args.perPage && typeof args.perPage === 'number' && args.perPage > 0 && args.perPage <= pagination.perPageMax) ? args.perPage : pagination.perPageDefault,
			page: (args.page && typeof args.page === 'number' && args.page > 0) ? args.page : 1,
			get skip () { return this.perPage * (this.page - 1) }
		}
	}
}

export const check = {
	/**
	 * Validate if defined and non-null
	 *
	 * @param	input					Input field.
	 * @param	type					Expected type of input.
	 * @param	optional				If it's optional.
	 *
	 * @return 	Boolean|GraphQLError	If valid return true, if invalid throw input error.
	 */
	validate: (input: any, type: string, optional: boolean = false): boolean|GraphQLError => {
		const nonNull: boolean = (input !== undefined && input !== null);

		if (nonNull && type === 'string' && typeof input === type && input.length > 0) return true; // Check string
		else if (nonNull && type === 'boolean' && typeof input === 'boolean') return true; // Check boolean
		else if (nonNull && type === 'array' && Array.isArray(input) && input.length > 0) return true; // Check array
		else if (nonNull && type === 'object' && typeof input === 'object') return true; // Check object
		else if (nonNull && type === 'ObjectId' && mongoose.isValidObjectId(input)) return true; // Check ObjectId
		else {
			if (optional) return false
			else throw new GraphQLError('Input empty or wrong type', {extensions: {code: 'BAD_USER_INPUT'}});
		}
	},
	needs: (system: string):void|GraphQLError => {
		if (system === 'mongo' && $DB.mongo !== 'connected') {
			throw new GraphQLError('Database unavailable.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
		} else if (system === 'redis' && $DB.redis !== 'connected') {
			throw new GraphQLError('Session database unavailable.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
		}
	},
	isSessionValid: (session: ContextInterface["session"]): session is SessionType => (!!session && session !== 'invalid'),
	session: (session: ContextInterface["session"]): true|GraphQLError => {
		if (check.isSessionValid(session)) return true;

		throw new GraphQLError('Unauthenticated. You need to be logged in to access this resource.', {
			extensions: {
				code: 'UNAUTHORIZED',
				http: { status: 401 }
			},
		});
	},
	/**
	 * @description
	 *
	 * Check if user has claims on the resource.
	 *
	 * @param 	session		Current session from context.
	 * @param	createdBy	User ID to check ownership against.
	 *
	 * @return	Boolean|GraphQLError	If checks pass, return true, else error.
	 */
	isOwner: (session:ContextInterface["session"] = undefined, createdBy: IdType): true|GraphQLError => {
		// Handle no session
		check.session(session)

		let authorized: boolean = false; // Default to false

		if ((session as SessionType).userId === createdBy || (session as SessionType).isAdmin) authorized = true;

		// Handle user not authorized
		if (!authorized) {
			throw new GraphQLError('Unauthorized. You do not have access to this resource.', {
				extensions: {
					code: 'FORBIDDEN',
					http: { status: 403 }
				},
			});
		}

		// Return check result
		return authorized;
	},
	/**
	 * @description
	 *
	 * Check if user has permissions to run this operation (query or mutation).
	 *
	 * @param 	session		Current session from context.
	 * @param	silent		Decides whether to throw GraphQLError or return boolean.
	 *
	 * @return	Boolean|GraphQLError	If checks pass, return true, else error.
	 */
	isAdmin: (session: ContextInterface["session"] = undefined, silent: boolean = false): boolean|GraphQLError => {
		// Handle no session
		check.session(session)

		if (!session) return false;

		let authorized: boolean = false; // Default to false

		if ((session as SessionType).isAdmin) authorized = true;

		// Handle user not authorized
		if (!authorized && !silent) {
			throw new GraphQLError('Unauthorized. You do not have access to this resource.', {
				extensions: {
					code: 'FORBIDDEN',
					http: { status: 403 }
				},
			});
		}

		// Return check result
		return authorized;
	}
}


// @todo Types and rework
export const getIP = (req: IncomingMessage): string|undefined => {
	if (!req) return undefined;

	return ((req?.headers?.["p9s-user-ip"] || req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || req?.socket?.remoteAddress || undefined) as string);
}

export const getUA = (req: IncomingMessage): string|undefined => {
	return req.headers?.['user-agent'] || undefined;
}

// @todo Types
export const setupMeta = (session: ContextInterface["session"], input: any, node:any = undefined) => {
	const timestamp = new Date().toISOString();

	if (!node) {
		input.createdBy = (check.isSessionValid(session)) ? session?.userId : null;
		input.createdAt = timestamp;
		input.version = 0;

		return input;
	} else {
		node.updatedBy = (check.isSessionValid(session)) ? session?.userId : null;
		node.updatedAt = timestamp;
		node.version = node.version + 1;

		return node;
	}
}

export const handleError = (err: Error, domain?: string): void|CriticalError => {
	// Do nothing on custom errors, they log everything on their own
	if (['InternalError', 'CriticalError', 'FatalError'].includes(err.name)) return;
	return new CriticalError(err?.message?`Unexpected error captured: ${err.message}`:'Unexpected error captured', 'UNKNOWN', domain||undefined, err?.stack)
}