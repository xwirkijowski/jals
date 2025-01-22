import { EntityId } from 'redis-om'
import { check } from "@util/helpers";

// Types
import {IContext, UContextSession} from "@type/context.types";
import {TSessionInstance} from "@service/auth/session";
import {THydratedUser} from "@model/user.types";

export default {
	Session: { // No need for auth checks, since output based on session.
		id: (obj: TSessionInstance): string | null => obj[EntityId] || obj.sessionId || null,
		user: async ({userId}: TSessionInstance, _: any, {models: {user}}: IContext): Promise<THydratedUser> => (userId) ? await user.findOne({_id: userId}) : null,
	},
	Query: {
		session: async (_: any, {sessionId}, {services: {auth}, internal: {requestId}}: IContext): Promise<TSessionInstance> => {
			check.needs('redis');
			check.validate(sessionId, 'string');

			const sessionNode = await auth.retrieveSession(sessionId, requestId);

			return (sessionNode?.userId) ? sessionNode : null;
		},
		sessionsByUser: async (_: any, {userId}, {services: {auth}, internal: {requestId}}: IContext): Promise<TSessionInstance[]> => {
			check.needs('redis');
			check.validate(userId, 'string');

			const sessionNodes = await auth.retrieveSessionByUserId(userId, requestId);

			console.log(sessionNodes);

			return sessionNodes;
		},
		currentUser: async (_: any, __: any, {models: {user}, session}: IContext): Promise<THydratedUser> => {
			check.needs('redis');
			check.needs('mongo');

			return await user.findOne({_id: (session as TSessionInstance).userId}) || null
		},
		currentSession: (_: any, __: any, {session}: IContext): UContextSession|null => {
			return (session) ? session : null;
		}
	},
}