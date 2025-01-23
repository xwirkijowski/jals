import {EntityId} from 'redis-om'
import {check} from "@util/helpers";

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
		session: async (_: any, args: {sessionId: string}, {services: {auth}, internal: {requestId}}: IContext): Promise<TSessionInstance> => {
			check.needs('redis');
			const readyArgs = check.validator.prepareArgs(args, {
				sessionId: {
					type: 'ObjectId',
				}
			})

			return await auth.retrieveSession(readyArgs.sessionId, requestId);
		},
		sessionsByUser: async (_: any, args: {userId: string}, {services: {auth}, internal: {requestId}}: IContext): Promise<TSessionInstance[]> => {
			check.needs('redis');
			const readyArgs = check.validator.prepareArgs(args, {
				userId: {
					type: 'ObjectId',
				}
			})

			return await auth.retrieveSessionByUserId(readyArgs.userId, requestId);
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