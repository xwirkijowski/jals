import mongoose from 'mongoose';
import { GraphQLError } from "graphql";

import { $DB } from "@/database/status";
import {TSessionInstance} from "@service/auth/session";
import {IContext} from "@type/context.types";
import {TId} from "@type/id.types";
import {CriticalError} from "./error";
import {Result, TResult} from "@schema/result";

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

// Types

export interface IValidateData {
	type: 'string'|'number'|'boolean'|'ObjectId'
	normalize?: boolean
	optional?: boolean
	length?: number
}

export type TValidateData = {
	[key: string]: IValidateData // | TValidateData
}

// @todo Refactor to deduplicate and optimize
class Validator {
	errorCode = {
		malformed: 'BAD_USER_INPUT',
		invalid: 'INPUT_INVALID',
		type: 'INPUT_WRONG_TYPE',
		empty: 'INPUT_EMPTY',
	}
	
	private buildError (path: string, key: string, condition?: any) {
		const message = {
			malformed: '',
			invalid: '',
			length: `Input field ${path} must have exactly ${condition} length`,
			type: `Input field ${path} is of wrong type`,
			empty: `Input field ${path} is empty`,
		}
		
		return [this.errorCode[key] as string, path as string, message[key] as string] as const;
	}
	
	private buildGraphQLError (path: string, key: string, condition?: any): GraphQLError {
		const message = {
			malformed: '',
			invalid: '',
			length: `Input field ${path} must have exactly ${condition} length`,
			type: `Input field ${path} is of wrong type`,
			empty: `Input field ${path} is empty`,
		}
		
		return new GraphQLError(message[key], {path: [path], extensions: {code: 'BAD_USER_INPUT'}})
	}
	
	prepareArgs (input: unknown, struct: TValidateData): any {
		let readyArgs = {};
	
		if (typeof input !== 'object' || Object.keys(input).length === 0) throw new GraphQLError('Input empty or wrong type', {extensions: {code: 'BAD_USER_INPUT'}})
		
		for (const [key, data] of Object.entries(struct)) {
			const normalize: boolean = data?.normalize || false;
			const optional: boolean = data?.optional || false;
			
			let inputValue = input[key];
			
			if (!optional && (!inputValue || (inputValue && !check.nonNull(inputValue)))) {
				throw this.buildGraphQLError(key, 'empty')
			} else if (optional && !inputValue) continue;
			
			if (data.type === 'string') {
				if (typeof inputValue !== data.type) {
					throw this.buildGraphQLError(key, 'type')
				} else if (inputValue.length === 0) {
					throw this.buildGraphQLError(key, 'empty')
				} else if (data.length && inputValue.length !== data.length) {
					throw this.buildGraphQLError(key, 'length', data.length)
				}
				
				readyArgs[key] = (normalize) ? String(inputValue).normalize('NFKD') : String(inputValue);
			} else if (data.type === 'boolean') {
				if (typeof inputValue !== data.type) {
					throw this.buildGraphQLError(key, 'type')
				}
				
				readyArgs[key] = Boolean(inputValue);
			} else if (data.type === 'number') {
				if (typeof inputValue !== data.type) {
					throw this.buildGraphQLError(key, 'type')
				}
				
				readyArgs[key] = Number(inputValue);
			} else if (data.type === 'ObjectId') {
				if (!mongoose.isValidObjectId(inputValue)) {
					throw this.buildGraphQLError(key, 'type')
				}
				
				readyArgs[key] = inputValue;
			}
		}
		
		return readyArgs
	}
	
	prepareInput (input: unknown, struct: TValidateData, result: TResult = new Result()): {readyInput?: any, result: TResult} {
		let readyInput = {};
		
		if (typeof input !== 'object') {return {readyInput, result: result.addError('BAD_USER_INPUT', 'input', 'Input wrong type')}}
		else if (Object.keys(input).length === 0) return {readyInput, result: result.addError('INPUT_EMPTY', 'input', 'Input empty')};

		for (const [key, data] of Object.entries(struct)) {
			const normalize: boolean = data?.normalize || false;
			const optional: boolean = data?.optional || false;
			
			let inputValue = input[key];
			const path = `input.${key}`
			
			if (!optional && (!inputValue || (inputValue && !check.nonNull(inputValue)))) {
				result.addError(...this.buildError(path, 'empty'));
				continue;
			} else if (optional && !inputValue) continue;
			
			if (data.type === 'string') {
				if (typeof inputValue !== data.type) {
					result.addError(...this.buildError(path, 'type'));
					continue;
				} else if (inputValue.length === 0) {
					result.addError(...this.buildError(path, 'empty'));
					continue;
				} else if (data.length && inputValue.length !== data.length) {
					result.addError(...this.buildError(path, 'length', data.length));
					continue;
				}
				
				readyInput[key] = (normalize) ? String(inputValue).normalize('NFKD') : String(inputValue);
			} else if (data.type === 'boolean') {
				if (typeof inputValue !== data.type) {
					result.addError(...this.buildError(path, 'type'));
					continue;
				}
				
				readyInput[key] = Boolean(inputValue);
			} else if (data.type === 'number') {
				if (typeof inputValue !== data.type) {
					result.addError(...this.buildError(path, 'type'));
					continue;
				}
				
				readyInput[key] = Number(inputValue);
			} else if (data.type === 'ObjectId') {
				if (!mongoose.isValidObjectId(inputValue)) {
					result.addError(...this.buildError(path, 'type'));
					continue;
				}
				
				readyInput[key] = inputValue;
			}
		}
	
		return {readyInput, result}
	}
}

export const check = {
	validator: new Validator(),
	
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
	// @todo Documentation, better types, implement pattern for email and web addresses
	nonNull: (v: string|number|boolean|Object|Array<string|number|boolean|Object>): boolean => (v !== undefined && v !== null),
	needs: (system: string):void|GraphQLError => {
		if (system === 'mongo' && $DB.mongo !== 'connected') {
			throw new GraphQLError('Database unavailable.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
		} else if (system === 'redis' && $DB.redis !== 'connected') {
			throw new GraphQLError('Session database unavailable.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
		}
	},
	isSessionValid: (session: IContext["session"]): session is TSessionInstance => (session && session !== 'invalid'),
	session: (session: IContext["session"]): true|GraphQLError => {
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
	isOwner: (session:IContext["session"] = undefined, createdBy: TId): true|GraphQLError => {
		// Handle no session
		check.session(session)

		let authorized: boolean = false; // Default to false

		if ((session as TSessionInstance)?.userId.toString() === createdBy.toString() || (session as TSessionInstance)?.isAdmin === true) authorized = true;
		
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
	isAdmin: (session: IContext["session"] = undefined, silent: boolean = false): boolean|GraphQLError => {
		// Handle no session
		check.session(session)

		if (!session) return false;

		let authorized: boolean = false; // Default to false

		if ((session as TSessionInstance).isAdmin) authorized = true;

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


export const getIP = (req: IContext['req']): string|undefined => {
	if (!req) return undefined;

	return ((req?.headers?.["jals-user-addr"] || req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || req?.socket?.remoteAddress) as string) ||  undefined;
}

export const getUA = (req: IContext['req']): string|undefined => {
	return ((req.headers?.['jals-user-agent'] || req.headers?.['user-agent']) as string) || undefined;
}

// @todo Types
export const setupMeta = (session: IContext["session"], input: any, node:any = undefined) => {
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

/**
 *
 * @since 2.1.2
 */
export function setupPagination (readyArgs, pagination) {
	const perPage = (readyArgs?.perPage && readyArgs.perPage <= pagination.perPageMax) ? readyArgs?.perPage : pagination.perPageDefault;
	const skip = (readyArgs?.page && readyArgs.page > 1) ? (readyArgs.page - 1) * perPage : 0;
	
	return [perPage, skip];
}

/**
 *
 * @since 2.1.2
 */
export function setupPageInfo (total, perPage, readyArgs) {
	return {
		total: total,
		perPage: perPage,
		pageCount: Math.ceil(total / perPage),
		currentPage: readyArgs?.page || 1,
	}
}