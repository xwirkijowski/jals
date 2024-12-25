export default {
	User: {
		id: ({_id}) => { return _id; },
		createdBy: async ({createdBy}, _, {models: {user}}) => {
			return (createdBy) ? await user.findOne({_id: createdBy}) : null;
		},
		updatedBy: async ({updatedBy}, _, {models: {user}}) => {
			return (updatedBy) ? await user.findOne({_id: updatedBy}) : null;
		},
	},
	Query: {
		user: async (_, args, {session, models: {user}}) => {
			// @todo Auth and `isAdmin` check
			return await user.findOne({id: args.userId});
		},
	},
}