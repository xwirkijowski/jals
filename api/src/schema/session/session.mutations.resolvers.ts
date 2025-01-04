import { Result } from "../result";
import { check } from "../../utilities/helpers";

// Types
import {ContextInterface as CtxI} from "../../types/context.types";
import AuthCodeType from "../../services/auth/authCode";
import SessionType from "../../services/auth/session";
import {HydratedUser} from "../../types/models/user.types";

export default {
	Mutation: {
		requestAuthCode: async (_, {input} , {models, services, session, internal: {requestId}}: CtxI) => {
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
			const userNode: HydratedUser = await models.user.findOne({email: input.email})

			// If no user found or if user found but passwords do not match return operation failed
			if (!userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Create loginCode @todo Fix handling
			let codeNode: AuthCodeType|void;
			try {
				codeNode = await services.auth.createCode(userNode._id, userNode.email, requestId);
			} catch (err) { return result.addError('INTERNAL_ERROR').response(true); }


			if (codeNode) {
				return result.response(true)
			} else {
				return result.addErrorAndLog('CANNOT_CREATE_CODE', null, null, 'error', 'Failed to create an auth code', 'AuthService').response(true);
			}
		},
		logIn: async (_, {input}, {models, services, session, req, internal: {requestId}}: CtxI) => {
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
			const userNode: HydratedUser = await models.user.findOne({email: input.email})

			// If no user found or if user found but passwords do not match return operation failed
			if (!userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Check code
			let codeNode: AuthCodeType|false;
			try {
				codeNode = await services.auth.checkCode(userNode._id, input.code, requestId);
				if (!codeNode) return result.addError('INVALID_CODE', undefined, 'Login failed, invalid code').response(true);
			} catch (err) { return result.addError('INTERNAL_ERROR').response(true); }

			// Create a session @todo Fix handling
			let sessionNode: SessionType|boolean;
			try {
				sessionNode = await services.auth.createSession(userNode._id, userNode.isAdmin, req, requestId);
			} catch (err) { return result.addError('INTERNAL_ERROR').response(true); }

			if (sessionNode) {
				return result.response(true, {
					sessionId: (sessionNode as SessionType).sessionId,
					user: userNode
				});
			} else {
				return result.addError('LOGIN_FAILED', undefined, 'Unknown problem occurred, cannot log in.').response(true);
			}

		},
		// @todo Implement logout mutations

	}
}