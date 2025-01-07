import {ContextInterface as CtxI} from "../../types/context.types";
import {IdType} from "../../types/id.types";
import {HydratedUser} from "../../types/models/user.types";

export default {
	User: {
		id: ({_id}: {_id: IdType|null}): IdType|null => { return _id || null; },
		createdBy: async ({createdBy}: {createdBy: IdType|null}, _: any, {models: {user}}: CtxI): Promise<HydratedUser|null> => {
			return (createdBy) ? await user.findOne({_id: createdBy}) : null;
		},
		updatedBy: async ({updatedBy}: {updatedBy: IdType|null}, _: any, {models: {user}}: CtxI): Promise<HydratedUser|null> => {
			return (updatedBy) ? await user.findOne({_id: updatedBy}) : null;
		},
	},
	Query: {
		user: async (_: any, args, {session, models: {user}}: CtxI) => {
			// @todo Auth and `isAdmin` check
			return await user.findOne({id: args.userId});
		},
	},
}