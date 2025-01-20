import {IContext} from "@type/context.types";
import {TId} from "@type/id.types";
import {THydratedUser} from "@model/user.types";

export default {
	User: {
		id: ({_id}: {_id: TId}): TId => { return _id; },
		createdBy: async ({createdBy}: {createdBy: TId}, _: any, {models: {user}}: IContext): Promise<THydratedUser|null> => (createdBy) ? await user.findOne({_id: createdBy}) : null,
		updatedBy: async ({updatedBy}: {updatedBy: TId}, _: any, {models: {user}}: IContext): Promise<THydratedUser|null> => (updatedBy) ? await user.findOne({_id: updatedBy}) : null,
	},
	Query: {
		user: async (_: any, args, { models: {user}}: IContext): Promise<THydratedUser|null> => await user.findOne({id: args.userId}),
	},
}