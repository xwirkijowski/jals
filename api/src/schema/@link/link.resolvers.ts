import { check } from "../../utilities/helpers";

// Types
import {THydratedLink} from "../../models/link.types";
import {TId} from "../../types/id.types";
import {IContext} from "../../types/context.types";

export default {
	Link: {
		id: ({_id}: THydratedLink): TId => _id,
		active: ({active}: THydratedLink): boolean => active || false,
		flagCount: (obj: THydratedLink): number =>  obj?.flags?.length ?? 0,
		createdBy: async ({createdBy}: THydratedLink, _:any, {models: {user}}: IContext) => (createdBy) ? await user.findOne({_id: createdBy}) : null,
		updatedBy: async ({updatedBy}: THydratedLink, _:any, {models: {user}}: IContext) => (updatedBy) ? await user.findOne({_id: updatedBy}) : null,
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
		link: async (_, args, {models: {link}}: IContext): Promise<THydratedLink|null> => {
			check.needs('mongo');
			check.validate(args.linkId, 'ObjectId', false);

			return await link.findOne({_id: args.linkId});
		},
		links: async (_, args, { session, models: {link}}: IContext) => {
			check.needs('mongo');

			// @todo Implement

			const filter = {};
			const page = {};

			// Set up search
			const nodes = await link.find(filter, null)


		}
	},
}