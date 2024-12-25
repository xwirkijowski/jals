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
}