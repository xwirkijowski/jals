import { check } from "../../utilities/helpers";

// Types
import {HydratedLink} from "../../types/models/link.types";
import {IdType} from "../../types/id.types";
import {ContextInterface as CtxI} from "../../types/context.types";

export default {
	Link: {
		id: ({_id}: HydratedLink): IdType => _id,
		active: ({active}: HydratedLink): boolean => active ?? false,
		clickCount: async (obj: HydratedLink, _:void, {session, models: {click}}: CtxI): Promise<number> =>
			await click.countDocuments({linkId: obj._id})??0,
		flagCount: (obj: HydratedLink): number =>  obj?.flags?.length??0,
		createdBy: async ({createdBy}: HydratedLink, _:void, {session, models: {user}}: CtxI) => {
			check.isAdmin(session);
			return (createdBy) ? await user.findOne({_id: createdBy}) : null;
		},
		updatedBy: async ({updatedBy}: HydratedLink, _:void, {session, models: {user}}: CtxI) => {
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
		link: async (_, args, {models: {link}}: CtxI): Promise<HydratedLink|null> => {
			check.needs('mongo');
			check.validate(args.linkId, 'ObjectId', false);

			return await link.findOne({_id: args.linkId});
		},
		links: async (_, args, { session, models: {link}}: CtxI) => {
			check.isAdmin(session);

			// @todo Implement

			const filter = {};
			const page = {};

			// Set up search
			const nodes = await link.find(filter, null)


		}
	},
}