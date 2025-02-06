import {Result, TResult} from "@schema/result";
import {check, getIP, getUA, handleError, setupMeta} from "@util/helpers";
import {globalLogger as log} from '@util/logging/log';
import {CriticalError} from "@util/error";

// Types
import {IContext} from "@type/context.types";
import AuthCodeType, {TAuthCodeInstance} from "@service/auth/authCode";
import SessionType, {TSessionInstance} from "@service/auth/session";
import {THydratedUser} from "@model/user.types";
import {ERequestAuthCodeAction, IAuthInput, IRequestAuthCodeInput} from "./session.types";
import {TId} from "@type/id.types";

const handleAction = (readyInput: any) => {
	// Set default action to `LOGIN` if none specified or invalid
	if (!readyInput.action || !['LOGIN', 'REGISTER'].includes(readyInput.action)) readyInput.action = ERequestAuthCodeAction["LOGIN"];

	// Assign to variable, remove form input
	const action: ERequestAuthCodeAction = ERequestAuthCodeAction[readyInput.action];
	delete readyInput.action;

	return action;
}

const validateAuthInput = (input: IAuthInput): { readyInput: IAuthInput, result: TResult } => {
	const {readyInput, result} = check.validator.prepareInput(input, {
		email: {
			type: 'string',
			optional: !!(input.magic)
		},
		code: {
			type: 'string',
			length: 8,
			optional: !!(input.magic)
		},
		magic: {
			type: 'string',
			optional: !!(input?.code)
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

// @todo Get rid of try...catch

export default {
	Mutation: {
		requestAuthCode: async (_: any, {input}: {input: IRequestAuthCodeInput} , {models: {user}, services, session, internal: {requestId}, req}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			if (check.isSessionValid(session)) return new Result().addError('ALREADY_LOGGED_IN').response();

			// Validate required input fields
			const {readyInput, result} = check.validator.prepareInput(input, {
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

			const action: ERequestAuthCodeAction = handleAction(readyInput);

			// Get user by email
			const userNode: THydratedUser = await user.findOne({email: readyInput.email})

			if (!userNode && action === ERequestAuthCodeAction.LOGIN) { // If no user found on `LOGIN` return error
				return result.addError('INVALID_CREDENTIALS').response();
			} else if (action === ERequestAuthCodeAction.REGISTER && userNode) { // If user found on `REGISTER` return error
				return result.addError('ALREADY_EXISTS').response();
			}

			const codeNode: TAuthCodeInstance|undefined = await services.auth.requestCode(
				(action === ERequestAuthCodeAction.LOGIN)?userNode._id:undefined,
				(action === ERequestAuthCodeAction.LOGIN)?userNode.email:readyInput.email,
				action, requestId
			)
			if (!codeNode) return result.addError('INTERNAL_ERROR').response();

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

			let codeNode: TAuthCodeInstance|undefined,
				userNode: THydratedUser|undefined;
			
			if (readyInput.magic) {
				codeNode = await services.auth.checkCode(undefined, undefined, readyInput?.magic, ERequestAuthCodeAction['LOGIN'], requestId);
				if (!codeNode) return result.addError('CODE_NOT_FOUND').response();

				userNode = await user.findOne({_id: codeNode.userId});
				if (!userNode) return result.addError('INVALID_CREDENTIALS').response();
			} else {
				userNode = await user.findOne({email: readyInput.email});
				if (!userNode) return result.addError('INVALID_CREDENTIALS').response();
				
				codeNode = await services.auth.checkCode(userNode._id, readyInput?.code, undefined, ERequestAuthCodeAction['LOGIN'], requestId);
				if (!codeNode) return result.addError('CODE_NOT_FOUND').response();
			}
			
			if (!userNode || !codeNode) return result.addError('INTERNAL_ERROR').response();
			
			// Create a session
			const sessionNode: TSessionInstance|undefined = await services.auth.createSession(userNode._id, userNode.isAdmin, req, requestId);
			if (!sessionNode) return result.addError('INTERNAL_ERROR').response();

			// Invalidate used code
			const invalidateCode = await services.auth.invalidateCode(codeNode, requestId);
			if (!invalidateCode) return result.addError('INTERNAL_ERROR').response();

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
			
			let codeNode: TAuthCodeInstance|undefined,
				userNode: THydratedUser|undefined;
			
			if (readyInput.magic) {
				// Check code, return response if not found
				codeNode = await services.auth.checkCode(undefined, undefined, readyInput?.magic, ERequestAuthCodeAction['REGISTER'], requestId);
				if (!codeNode) return result.addError('CODE_NOT_FOUND').response();
				
				// Check for existing user
				userNode = await user.findOne({_id: codeNode.userId});
				if (userNode) return result.addError('INVALID_CREDENTIALS').response();
			} else {
				// Check for existing user
				userNode = await user.findOne({email: readyInput.email});
				if (userNode) return result.addError('INVALID_CREDENTIALS').response();
				
				// Check code, return response if not found
				codeNode = await services.auth.checkCode(undefined, readyInput?.code, undefined, ERequestAuthCodeAction['REGISTER'], requestId);
				if (!codeNode) return result.addError('CODE_NOT_FOUND').response();
			}
			
			if (!codeNode) return result.addError('INTERNAL_ERROR').response();
			
			// Construct new user and set up metadata
			const newUser = setupMeta(session, {
				email: codeNode.userEmail,
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
			const sessionNode: TSessionInstance|undefined = await services.auth.createSession(createdUser._id, false, req, requestId);
			if (!sessionNode) return result.addError('INTERNAL_ERROR').response();
			
			// Invalidate used code
			const invalidateCode = await services.auth.invalidateCode(codeNode, requestId);
			if (!invalidateCode) return result.addError('INTERNAL_ERROR').response();

			if (sessionNode) {
				return result.response(true, {
					sessionId: (sessionNode as SessionType).sessionId,
					user: createdUser,
				});
			} else {
				return result.addError('LOGIN_FAILED', undefined, 'Unknown problem occurred, cannot log in.').response();
			}
		},
		logOut: async (_: any, __:any, {services: {auth}, session, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');

			if (!check.isSessionValid(session)) return new Result().addError('NOT_LOGGED_IN').response()
			
			const result = new Result();

			const invalidateSession = await auth.invalidateSession(session, requestId);
			if (!invalidateSession) return result.addError('LOGOUT_FAILED', undefined, 'Unknown problem occurred, cannot log out and remove session.').response();
			
			session = undefined;

			return result.response()
		},
		logOutAll: async (_: any, __:any, {services: {auth}, session, internal: {requestId}}: IContext) => {
			check.needs('redis');
			check.needs('mongo');
			
			if (!check.isSessionValid(session)) return new Result().addError('NOT_LOGGED_IN').response()
			
			const result = new Result();
			
			const invalidateSessions = await auth.invalidateAllSessions(session.userId, requestId);
			if (!invalidateSessions) return result.addError('LOGOUT_ALL_FAILED', undefined, 'Unknown problem occurred, cannot remove all sessions.').response();
			
			session = undefined;
			
			return result.response(true, {deletedCount: invalidateSessions});
		},
		deleteSession: async (_: any, input: {sessionId: string}, {services: {auth}, session, req, res, internal: {requestId}}: IContext ) => {
			// @todo Implement
		},
		deleteAllSessions: async (_: any, input: {userId: TId}, {services: {auth}, session, req, res, internal: {requestId}}: IContext) => {
			// @todo Implement
		
		}
	}
}