import {Result, TResult} from "../result";
import {check, getIP, getUA, handleError, setupMeta} from "../../utilities/helpers";
import {log} from "../../services/auth/service";

// Types
import {IContext} from "../../types/context.types";
import AuthCodeType from "../../services/auth/authCode";
import SessionType from "../../services/auth/session";
import {THydratedUser} from "../../models/user.types";
import {ERequestAuthCodeAction, IAuthInput, IRequestAuthCodeInput} from "./session.types";
import {CriticalError} from "../../utilities/errors";

const validateAuthInput = (input: IAuthInput): { readyInput: IAuthInput, result: TResult } => {
	const {readyInput, result} = check.prepareInput(input, {
		email: {
			type: 'string',
		},
		code: {
			type: 'string',
			length: 8,
		},
		userAgent: {
			type: 'string',
			normalize: true,
			optional: true,
		},
		userAddr: {
			type: 'string',
			optional: true,
		}
	})

	return {readyInput, result};
}

export default {
	Mutation: {
		requestAuthCode: async (_: any, {input}: {input: IRequestAuthCodeInput} , {models: {user}, services, session, internal: {requestId}, req}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			if (check.isSessionValid(session)) return new Result().addError('ALREADY_LOGGED_IN').response();

			// Validate required input fields
			const {readyInput, result} = check.prepareInput(input, {
				email: {
					type: 'string',
					normalize: true,
				},
				action: {
					type: 'string',
					optional: true,
				}
			});
			if (result.hasErrors()) return result.response();

			// Set default action to `LOGIN` if none specified or invalid
			if (!readyInput.action || !['LOGIN', 'REGISTER'].includes(readyInput.action)) readyInput.action = ERequestAuthCodeAction["LOGIN"];

			// Assign to variable, remove form input
			const action: ERequestAuthCodeAction = ERequestAuthCodeAction[readyInput.action];
			delete readyInput.action;

			// Get user by email
			const userNode: THydratedUser = await user.findOne({email: readyInput.email})

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
					codeNode = await services.auth.createCode(undefined, readyInput.email, action, requestId);
				}
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Send the email
			let emailTransaction: string|void
			try {
				emailTransaction = await services.mail.create(userNode?.email||readyInput.email, 'Your authentication code', {
					authCode: (codeNode as AuthCodeType),
					userAddr: getIP(req),
					userAgent: getUA(req),
					action
				}, requestId).send();
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			if (emailTransaction) {
				return result.response()
			} else {
				return result.addErrorAndLog('CANNOT_CREATE_CODE', null, null, 'error', 'Failed to create an auth code', 'Resolvers').response();
			}
		},
		logIn: async (_: any, {input}: {input: IAuthInput}, {models: {user}, services, session, req, res, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			if (check.isSessionValid(session)) return new Result().addError('ALREADY_LOGGED_IN').response();

			const {readyInput, result} = validateAuthInput(input);
			if (result.hasErrors()) return result.response();

			// Get user by email
			const userNode: THydratedUser = await user.findOne({email: readyInput.email})

			// If no user found return operation failed
			if (!userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Check code
			let codeNode: AuthCodeType|false;
			try {
				codeNode = await services.auth.checkCode(userNode._id, readyInput.code, ERequestAuthCodeAction['LOGIN'], requestId);
				if (!codeNode) return result.addError('INVALID_CODE', undefined, 'Login failed, invalid code').response();
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Create a session
			let sessionNode: SessionType|boolean;
			try {
				sessionNode = await services.auth.createSession(userNode._id, userNode.isAdmin, req, res, requestId);
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Invalidate used code
			try {
				await codeNode.remove(requestId);
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			if (sessionNode) {
				return result.response(true, {
					sessionId: (sessionNode as SessionType).sessionId,
					user: userNode,
				});
			} else {
				return result.addError('LOGIN_FAILED', undefined, 'Unknown problem occurred, cannot log in.').response();
			}

		},
		register: async (_: any, {input}: {input: IAuthInput}, {models: {user}, services, session, req, res, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			if (check.isSessionValid(session)) return new Result().addError('ALREADY_LOGGED_IN').response();

			const {readyInput, result} = validateAuthInput(input);
			if (result.hasErrors()) return result.response();

			// Check for existing user
			const userNode: THydratedUser = await user.findOne({email: readyInput.email})

			// If user found return operation failed
			if (userNode) {
				return result.addError('INVALID_CREDENTIALS').response();
			}

			// Check code
			let codeNode: AuthCodeType|false;
			try {
				codeNode = await services.auth.checkCode(undefined, readyInput.code, ERequestAuthCodeAction['REGISTER'], requestId);
				if (!codeNode) return result.addError('INVALID_CODE', undefined, 'Login failed, invalid code').response(true);
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			// Construct new user and set up metadata
			const newUser = setupMeta(session, {
				email: readyInput.email,
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

			// Invalidate used code
			try {
				await codeNode.remove(requestId);
			} catch (err) {
				handleError(err, 'Resolvers'); return result.addError('INTERNAL_ERROR').response();
			}

			if (sessionNode) {
				return result.response(true, {
					sessionId: (sessionNode as SessionType).sessionId,
					user: createdUser,
				});
			} else {
				return result.addError('LOGIN_FAILED', undefined, 'Unknown problem occurred, cannot log in.').response();
			}
		},
		logOut: async (_: any, __:any, {session, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			if (!check.isSessionValid(session)) return new Result().addError('NOT_LOGGED_IN').response()

			const result = new Result();

			try {
				await session.remove(requestId);
			} catch (err) {
				return result.addError('LOGOUT_FAILED', undefined, 'Unknown problem occurred, cannot log out and remove session.').response();
			}

			session = undefined;

			return result.response()
		}
		// @todo Implement additional session management mutations
	}
}