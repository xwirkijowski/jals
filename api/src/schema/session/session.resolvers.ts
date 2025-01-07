import { EntityId } from 'redis-om'
import { check } from "../../utilities/helpers";

// Types
import {ContextInterface as CtxI} from "../../types/context.types";
import {SessionType} from "../../services/auth/session";

export default {
	Session: { // No need for auth checks, since output based on session.
		id: (obj: SessionType): string|null => {
			return obj[EntityId] || null;
		},
		/*
		user: (_, __, {session}: CtxI) => {
			return (session) ? session.user : null;
		},
		 */
		userAddr: (obj) => {
			return obj.userAddr;
		}
	},
	Query: {
		session: async (_, {sessionId}, {session, services: {auth}}: CtxI) => {
			check.needs('redis');
			check.validate(sessionId, 'string');
			check.isAdmin(session);

			// @todo integrate AuthService
			const sessionNode = await models.session.fetch(sessionId);

			return (sessionNode?.userId)?sessionNode:null;
		},
		sessionsByUser: async (_, {userId}, {session, models}: CtxI) => {
			check.needs('redis');
			check.validate(userId, 'string');
			check.isOwner(session, userId);

			const sessionNodes = await models.session.search().where('userId').eq(userId).return.all()

			return sessionNodes||[];
		},
		currentUser: async (_, __, {models: {user}, session}: CtxI) => {
			check.needs('redis');
			check.needs('mongo');
			check.session(session);

			return await user.findOne({_id: (session as SessionType).userId}) || null
		},
		currentSession: (_, __, {session}: CtxI) => {
			return (session) ? session : null;
		}
	},
}