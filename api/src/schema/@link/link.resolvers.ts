import { check } from "../../utilities/helpers";

// Types
import {HydratedLink} from "../../types/models/link.types";
import {IdType} from "../../types/id.types";
import {ContextInterface as CtxI} from "../../types/context.types";

export default {
	Link: {
		id: ({_id}: HydratedLink): IdType => _id,
		active: ({active}: HydratedLink): boolean => active || false,
		flagCount: (obj: HydratedLink): number =>  obj?.flags?.length ?? 0,
		createdBy: async ({createdBy}: HydratedLink, _:any, {models: {user}}: CtxI) => (createdBy) ? await user.findOne({_id: createdBy}) : null,
		updatedBy: async ({updatedBy}: HydratedLink, _:any, {models: {user}}: CtxI) => (updatedBy) ? await user.findOne({_id: updatedBy}) : null,
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
			check.needs('mongo');

			// @todo Implement

			const filter = {};
			const page = {};

			// Set up search
			const nodes = await link.find(filter, null)


		}
	},
}