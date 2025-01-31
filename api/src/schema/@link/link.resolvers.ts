import { check } from "@util/helpers";

// Types
import {THydratedLink} from "@model/link.types";
import {TId} from "@type/id.types";
import {IContext} from "@type/context.types";

export default {
	Link: {
		id: ({_id}: THydratedLink): TId => _id,
		active: ({active}: THydratedLink): boolean => active || false,
		flagCount: (obj: THydratedLink): number => obj?.flags?.length || 0,
		caution: (obj: THydratedLink): boolean => (!obj?.active || (obj?.active && (obj?.flags as Array<object>)?.length > 0)),
		createdBy: async ({createdBy}: THydratedLink, _:any, {models: {user}}: IContext) => (createdBy) ? await user.findOne({_id: createdBy}) : null,
		updatedBy: async ({updatedBy}: THydratedLink, _:any, {models: {user}}: IContext) => (updatedBy) ? await user.findOne({_id: updatedBy}) : null,
	},
	LinkConnection: {
		edges: ({nodes}: {nodes: THydratedLink[]}) => nodes,
		nodes: ({nodes}: {nodes: THydratedLink[]}) => nodes,
		pageInfo: ({pageInfo}) => pageInfo,
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
		links: async (_, args, {session, pagination, models: {link}}: IContext) => {
			check.needs('mongo');
			
			const readyArgs = check.validator.prepareArgs(args, {
				page: {type: "number", optional: true},
				perPage: {type: "number", optional: true},
				target: {type: "string", optional: true},
				hasFlags: {type: "boolean", optional: true},
				createdBy: {type: "ObjectId", optional: true},
			})

			const filter = {
				...((readyArgs?.createdBy) && {createdBy: readyArgs.createdBy}),
			};

			const perPage = (readyArgs?.perPage && readyArgs.perPage <= pagination.perPageMax) ? readyArgs?.perPage : pagination.perPageDefault;
			const skip = (readyArgs?.page && readyArgs.page > 1) ? (readyArgs.page - 1) * perPage : 0;
			
			const nodes: THydratedLink[] = await link.find(filter, null)
				.skip(skip)
				.limit(perPage);
			
			if (!nodes || nodes.length === 0) return;
			
			check.isOwner(session, nodes[0]?.createdBy);
			
			const total = await link.countDocuments(filter);
			
			const pageInfo = {
				total: total,
				perPage: perPage,
				pageCount: undefined,
				currentPage: readyArgs?.page || 1,
			}
			
			
			pageInfo.pageCount = Math.ceil(pageInfo.total / pageInfo.perPage);
			
			console.log(pageInfo, skip, perPage)
			// Set up search
			return {
				nodes,
				pageInfo
			};
		}
	},
}