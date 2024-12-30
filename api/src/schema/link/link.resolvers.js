import { check } from "../../utilities/helpers.js";

export default {
	Link: {
		id: ({_id}) => _id,
		clickCount: async (obj, _, {session, models: {click}}) =>
			await click.countDocuments({linkId: obj._id})??0,
		flagCount: (obj) =>  obj.flags.length??0,
		createdBy: async ({createdBy}, _, {session, models: {user}}) => {
			check.isAdmin(session);
			return (createdBy) ? await user.findOne({_id: createdBy}) : null;
		},
		updatedBy: async ({updatedBy}, _, {session, models: {user}}) => {
			check.isAdmin(session);
			return (updatedBy) ? await user.findOne({_id: updatedBy}) : null;
		},
	},
	LinkConnection: {
		edges: (obj) => { return obj.edges; },
		pageInfo: (obj) => { return obj.pageInfo; }
	},
	LinkEdge: {
		cursor: (obj) => { return obj._id; },
		node: (obj) => { return obj; }
	},
	Query: {
		link: async (_, args, {models: {link}}) => {
			check.needs('mongo');
			check.validate(args.linkId, 'ObjectId', false);

			return await link.findOne({_id: args.linkId});
		},
		links: async (_, args, {config, session, models: {link}}) => {
			check.isAdmin(session);

			const filter = {};
			const page = {};

			// Set up search
			const nodes = await link.find(filter, null)


		}
	},
}