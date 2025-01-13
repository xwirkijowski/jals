import { Result } from "../result";
import {check, getIP, getUA, handleError, setupMeta} from "../../utilities/helpers";
import {log} from "../../services/auth/service";

// Types
import {IContext} from "../../types/context.types";
import AuthCodeType from "../../services/auth/authCode";
import SessionType from "../../services/auth/session";
import {THydratedUser} from "../../models/user.types";
import {ERequestAuthCodeAction, IAuthInput, IRequestAuthCodeInput} from "./session.types";
import {CriticalError} from "../../utilities/errors";

const validateAuthInput = (input: IAuthInput): IAuthInput => {
	check.validate(input, 'object');
	check.validate(input.email, 'string');
	check.validate(input.code, 'string');
	check.validate(input?.userAgent, 'string', true);
	check.validate(input?.userAddr, 'string', true);

	return input;
}

export default {
	Mutation: {
		requestAuthCode: async (_: any, {input}: {input: IRequestAuthCodeInput} , {models: {user}, services, session, internal: {requestId}, req}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			// Check if user logged in
			if (session && session !== 'invalid') return new Result().addError('ALREADY_LOGGED_IN').response();

			const result = new Result();

			// Validate required input fields
			check.validate(input, 'object');
			check.validate(input.email, 'string');
			check.validate(input.action, 'string', true);

			// @todo Input sanitization

			// Set default action to `LOGIN` if none specified or invalid
			if (!input.action || !['LOGIN', 'REGISTER'].includes(input.action)) input.action = ERequestAuthCodeAction["LOGIN"];

			// Assign to variable, remove form input
			const action: ERequestAuthCodeAction = ERequestAuthCodeAction[input.action];
			delete input.action;

			// Normalize user input
			input.email = input.email.normalize('NFKD');

			// Get user by email
			const userNode: THydratedUser = await user.findOne({email: input.email})

			if (!userNode && action === 'LOGIN') { // If no user found on `LOGIN` return error
				return result.addError('INVALID_CREDENTIALS').response();
			} else if (action === 'REGISTER' && userNode) { // If user found on `REGISTER` return error
				return result.addError('ALREADY_EXISTS').response();
			}

			let codeNode: AuthCodeType|void;
			try {
				if (action === 'LOGIN') {
					codeNode = await services.auth.createCode(userNode._id, userNode.email, action, requestId);
				} else if (action === 'REGISTER') {
					codeNode = await services.auth.createCode(undefined, input.email, action, requestId);
				}
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Send the email
			let emailTransaction: string|void
			try {
				emailTransaction = await services.mail.create(userNode?.email||input.email, 'Your authentication code', {
					authCode: (codeNode as AuthCodeType),
					userAddr: getIP(req),
					userAgent: getUA(req),
					action
				}, requestId).send();
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			if (emailTransaction) {
				return result.response(true)
			} else {
				return result.addErrorAndLog('CANNOT_CREATE_CODE', null, null, 'error', 'Failed to create an auth code', 'Resolvers').response();
			}
		},
		logIn: async (_: any, {input}: {input: IAuthInput}, {models: {user}, services, session, req, res, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			// Check if user logged in
			if (session && session !== 'invalid') return new Result().addError('ALREADY_LOGGED_IN').response();

			const result = new Result();

			// Validate input fields
			validateAuthInput(input);

			// @todo Input sanitization

			// Normalize user input
			input.email = input.email.normalize('NFKD');
			if (input?.userAgent) input.userAgent.normalize('NFKD');

			// Get user by email
			const userNode: THydratedUser = await user.findOne({email: input.email})

			// If no user found return operation failed
			if (!userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Check code
			let codeNode: AuthCodeType|false;
			try {
				codeNode = await services.auth.checkCode(userNode._id, input.code, ERequestAuthCodeAction['LOGIN'], requestId);
				if (!codeNode) return result.addError('INVALID_CODE', undefined, 'Login failed, invalid code').response(true);
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Create a session
			let sessionNode: SessionType|boolean;
			try {
				sessionNode = await services.auth.createSession(userNode._id, userNode.isAdmin, req, res, requestId);
			}  catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			if (sessionNode) {
				return result.response(true, {
					sessionId: (sessionNode as SessionType).sessionId,
					user: userNode,
				});
			} else {
				return result.addError('LOGIN_FAILED', undefined, 'Unknown problem occurred, cannot log in.').response(true);
			}

		},
		register: async (_: any, {input}: {input: IAuthInput}, {models: {user}, services, session, req, res, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			// Check if user logged in
			if (session && session !== 'invalid') return new Result().addError('ALREADY_LOGGED_IN').response();

			const result = new Result();

			// Validate input fields
			validateAuthInput(input);

			// Normalize user input
			input.email = input.email.normalize('NFKD');
			if (input?.userAgent) input.userAgent.normalize('NFKD');

			// Check for existing user
			const userNode: THydratedUser = await user.findOne({email: input.email})

			// If user found return operation failed
			if (userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Check code
			let codeNode: AuthCodeType|false;
			try {
				codeNode = await services.auth.checkCode(undefined, input.code, ERequestAuthCodeAction['REGISTER'], requestId);
				if (!codeNode) return result.addError('INVALID_CODE', undefined, 'Login failed, invalid code').response(true);
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Construct new user and set up metadata
			const newUser = setupMeta(session, {
				email: input.email,
				isAdmin: false,
			});

			// Create a new user
			let createdUser: THydratedUser;
			try {
				createdUser = await user.create(newUser);
				if (!createdUser) throw new CriticalError('Could not insert a new user!', 'CREATE_USER_FAILED', 'Resolvers', true, {operationResult: createdUser})
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			log.withDomain('audit', 'Resolvers', "New user registered", {userId: createdUser._id, requestId: requestId});

			// Create a session
			let sessionNode: SessionType|boolean;
			try {
				sessionNode = await services.auth.createSession(createdUser._id, false, req, res, requestId);
			}  catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			if (sessionNode) {
				return result.response(true, {
					sessionId: (sessionNode as SessionType).sessionId,
					user: createdUser,
				});
			} else {
				return result.addError('LOGIN_FAILED', undefined, 'Unknown problem occurred, cannot log in.').response(true);
			}
		},

		// @todo Implement logout mutations
	}
}