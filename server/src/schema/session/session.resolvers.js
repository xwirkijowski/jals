import { EntityId } from 'redis-om'
import { Result } from "../../utilities/result.js";
import { check, getIP } from "../../utilities/helpers.js";

export default {
	Session: { // No need for auth checks, since output based on session.
		id: (obj) => {
			return obj[EntityId] || null;
		},
		user: (_, __, {session}) => {
			return (session) ? session.user : null;
		},
		userAddress: (obj) => {
			return obj.userAddr;
		}
	},
	Query: {
		session: async (_, {sessionId}, {session, models}) => {
			check.needs('redis');
			check.validate(sessionId, 'string');
			check.isAdmin(session);

			const sessionNode = await models.session.fetch(sessionId);

			return (sessionNode?.userId)?sessionNode:null;
		},
		sessionsByUser: async (_, {userId}, {session, models}) => {
			check.needs('redis');
			check.validate(userId, 'string');

			// Allow users to check their own sessions
			check.auth(session, 'ADMIN', true, (session && userId !== session?.userId));

			const sessionNodes = await models.session.search().where('userId').eq(userId).return.all()

			return sessionNodes||[];
		},
		currentUser: (_, __, {models: {user}, session}) => {
			return (session) ? session.user : null
		},
		currentSession: (_, __, {session}) => {
			return (session) ? session : null;
		}
	},
	Mutation: {
		requestAuthCode: async (_, {input}, {models, services, req, res, session, internal: {requestId}}) => {
			check.needs('redis');

			// Check if user logged in
			if (session && session !== 'invalid') return new Result().addError('ALREADY_LOGGED_IN').response();

			const result = new Result();

			// Validate required input fields
			check.validate(input, 'object');
			check.validate(input.email, 'string');

			// Normalize user input
			input.email = input.email.normalize('NFKD');

			// Get user by email
			const userNode = await models.user.findOne({email: input.email})

			// If no user found or if user found but passwords do not match return operation failed
			if (!userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Create loginCode
			const codeNode = await services.auth.createCode(userNode._id, userNode.email, requestId);

			if (codeNode) {
				return result.response(true)
			} else {
				return result.addErrorAndLog('CANNOT_CREATE_CODE', null, null, 'error', 'Failed to create an auth code', 'AuthService').response(true);
			}
		},
		logIn: async (_, {input}, {models, services, session, req, internal: {requestId}}) => {
			check.needs('redis');

			// Check if user logged in
			if (session && session !== 'invalid') return new Result().addError('ALREADY_LOGGED_IN').response();

			const result = new Result();

			// Validate required input fields
			check.validate(input, 'object');
			check.validate(input.email, 'string');
			check.validate(input.code, 'string');
			if (input?.userAgent) check.validate(input.userAgent, 'string');
			if (input?.userAddr) check.validate(input.userAddr, 'string');

			// Normalize user input
			input.email = input.email.normalize('NFKD');
			if (input?.userAgent) input.userAgent.normalize('NFKD');

			// Get user by email
			const userNode = await models.user.findOne({email: input.email})

			// If no user found or if user found but passwords do not match return operation failed
			if (!userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Check code
			const codeNode = await services.auth.checkCode(userNode._id, input.code, requestId);

			if (!codeNode) {
				return result.addError('INVALID_CODE', null, 'Login failed, invalid code').response(true);
			}

			// Create a session

			const sessionNode = await services.auth.createSession(userNode._id, req, requestId);

			if (sessionNode) {
				return result.response(true, {
					sessionId: sessionNode.sessionId,
					user: userNode
				});
			} else {
				return result.addError('LOGIN_FAILED', null, 'Unknown problem occurred, cannot log in.').response(true);
			}

		},
		logOut: async (_, __, {session, models}) => {
			check.needs('redis');

			// Check if user logged in
			if (!session) return new Result().addError('NOT_LOGGED_IN').response();

			const result = new Result();

			// Remove session from Redis
			await models.session.remove(session[EntityId]);

			// Verify that session has been deleted
			const sessionCheck = await models.session.fetch(session[EntityId]);

			if (sessionCheck.userId === undefined) {
				// Set context session to null
				session = null;

				return result.response()
			} else {
				return result.addErrorAndLog('SESSION_DELETE_FAILED', null, null, 'error', 'Failed to log out a user!', 'Session').response()
			}
		},
		logOutAll: async (_, __, {session, models}) => {
			check.needs('redis');

			// Check if user logged in
			if (!session) return new Result().addError('NOT_LOGGED_IN').response();

			const result = new Result();

			let sessionCount;

			// Collect all sessions
			const sessionNodes = await models.session.search().where('userId').eq(session.userId).return.all()

			// Map session Ids from all sessions
			const sessionIds = sessionNodes.map(node => node[EntityId]);
			sessionCount = sessionIds.length;

			// Remove session from Redis
			await models.session.remove(sessionIds);

			// Verify that sessions has been deleted
			const sessionsCheckNodes = await models.session.fetch(sessionIds);
			const sessionCheckIds = sessionsCheckNodes.filter(node => node?.userId);

			if (sessionCheckIds.length === 0) {
				// Set context session to null
				session = null;

				return result.response(true, {deletedCount: sessionCount});
			} else {
				return result.addErrorAndLog('SESSION_DELETE_ALL_FAILED', null, null, 'error', 'Failed to log our user out of all sessions!', 'Session').response(true)
			}
		}
	}
}