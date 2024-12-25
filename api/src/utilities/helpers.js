const f = {};

/**
 * Prepares basic pagination information needed for
 * database queries
 *
 * @author	Sebastian Wirkijowski <sebastian@wirkijowski.dev>
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
f.prepPagination = (args, pagination) => {
	return {
		perPage: (args.perPage && typeof args.perPage === 'number' && args.perPage > 0 && args.perPage <= pagination.perPageMax) ? args.perPage : pagination.perPageDefault,
		page: (args.page && typeof args.page === 'number' && args.page > 0) ? args.page : 1,
		get skip () { return this.perPage * (this.page - 1) }
	}
}

export default f;


import {GraphQLError} from "graphql";
import {$S} from "../database.js";

export const check = {
	/**
	 * Validate if defined and non-null
	 *
	 * @param	input					Input field.
	 * @param	type					Expected type of input.
	 * @return 	Boolean|GraphQLError	If valid return true, if invalid throw input error.
	 */
	validate: (input, type) => {
		if (input !== undefined // Is defined
			&& input !== null // Is not null
			&& (typeof input === type || type === 'array' && Array.isArray(input)) // Equals expected type
			&& ((typeof input === 'string' && input.length > 0) || true) // String is not empty
			&& ((type === 'array' && input.length > 0) || true)) return true; // Array is not empty
		else throw new GraphQLError('Input empty or wrong type', { extensions: { code: 'BAD_USER_INPUT' } });
	},
	needs: (system) => {
		if (system === 'db' && $S.db !== 'connected') {
			throw new GraphQLError('Database unavailable.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
		} else if (system === 'redis' && $S.redis !== 'connected') {
			throw new GraphQLError('Session database unavailable.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
		}
	},
	session: (session) => {
		if (!session || session === 'invalid') {
			throw new GraphQLError('Unauthenticated. You need to be logged in to access this resource.', {
				extensions: {
					code: 'UNAUTHORIZED'
				},
				http: { status: 401 }
			});
		} else return true
	},
	/**
	 * @description
	 *
	 * Check if user has claims on the resource.
	 *
	 * @param 	session		Current session from context.
	 * @param	node		Object to check ownership of.
	 *
	 * @return	Boolean|GraphQLError	If checks pass, return true, else error.
	 */
	isOwner: (session, node) => {
		// Handle no session
		check.session(session)

		let authorized = false; // Default to false

		if (session.user._id === node.createdBy || session.user.isAdmin === true) authorized = true;

		// Handle user not authorized
		if (!authorized) {
			throw new GraphQLError('Unauthorized. You do not have access to this resource.', {
				extensions: {
					code: 'FORBIDDEN'
				},
				http: { status: 403 }
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
	isAdmin: (session = undefined, silent = false) => {
		// Handle no session
		check.session(session)

		let authorized = false; // Default to false

		if (session.user.isAdmin === true) authorized = true;

		// Handle user not authorized
		if (!authorized && silent === false) {
			throw new GraphQLError('Unauthorized. You do not have access to this resource.', {
				extensions: {
					code: 'FORBIDDEN'
				},
				http: { status: 403 }
			});
		}

		// Return check result
		return authorized;
	}
}

export const getIP = (req) => {
	if (!req) return undefined;

	let ip;

	if (req.headers?.["p9s-user-ip"] !== null) { // Check custom header
		ip = req.headers["p9s-user-ip"];
	} else if (req.headers?.["x-forwarded-for"] !== null) { // Check x-forwarder-for header
		ip = req.headers["x-forwarded-for"].split(",")[0];
	} else if (req.headers?.["x-real-ip"] !== null) { // Check x-real-ip header @todo needs testing
		ip = req.headers["x-real-ip"];
	} else if (req.connection && req.connection.remoteAddress !== null) { // Check connection @todo needs testing
		ip = req.connection.remoteAddress;
	} else if (req.socket && req.socket.remoteAddress !== null) { // Check socket @todo needs testing
		ip = req.socket.remoteAddress;
	} else { // No IP found
		throw new GraphQLError('Cannot find IP address.', {
			extensions: {
				code: 'INTERNAL_SERVER_ERROR'
			}
		});
	}

	return ip;
}

export const setupMeta = (session, input, node = undefined) => {
	const timestamp = new Date().toISOString();

	if (!node) {
		input.createdBy = session?.userId||null;
		input.createdAt = timestamp;
	} else {
		input.updatedBy = session?.userId||null;
		input.updatedAt = timestamp;
	}

	input.version = (node?.version)?node.version+1:0;

	return input;
}