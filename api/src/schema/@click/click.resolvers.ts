import {check, setupPageInfo, setupPagination} from "@util/helpers";

// Types
import {IContext} from "@type/context.types";
import {THydratedClick} from "@model/click.types";
import {THydratedLink} from "@model/link.types";
import {TId} from "@type/id.types";

// @todo Types

export default {
	Click: {
		id: ({_id}: THydratedClick): TId => _id,
		link: async (obj: THydratedClick, _: any, {models: {link}}: IContext): Promise<THydratedLink|null> => (obj.linkId) ? await link.findOne({_id: obj.linkId}) : null,
		createdBy: async ({createdBy}: THydratedClick, _: any, {models: {user}}: IContext) => (createdBy) ? user.findOne({_id: createdBy}) : null,
	},
	ClickConnection: {
		edges: ({nodes}: {nodes: THydratedClick[]}) => nodes,
		nodes: ({nodes}: {nodes: THydratedClick[]}) => nodes,
		pageInfo: ({pageInfo}) => pageInfo,
	},
	ClickEdge: {
		cursor: (obj) => { return obj._id; },
		node: (obj) => { return obj; }
	},
	Query: {
		click: async (_: any, args, {models: {click}}: IContext) => await click.findOne({_id: args.clickId}),
		clicks: async (_: any, args, {session, pagination, models: {click, link}}: IContext) => {
			check.needs('mongo');
			
			const readyArgs = check.validator.prepareArgs(args, {
				page: {type: "number", optional: true},
				perPage: {type: "number", optional: true},
				linkId: {type: "ObjectId", optional: true},
			})
			
			const linkNode = await link.findOne({_id: readyArgs.linkId});
			
			check.isOwner(session, linkNode._id);
			
			const filter = {
				...((readyArgs?.linkId) && {linkId: readyArgs.linkId}),
			};
			
			const [perPage, skip] = setupPagination(readyArgs, pagination);
			
			const nodes: THydratedClick[] = await click.find(filter, null)
				.skip(skip)
				.limit(perPage);
			
			if (!nodes || nodes.length === 0) return {
				nodes: null,
				pageInfo: setupPageInfo(0, perPage, readyArgs)
			}
			
			const total: number = await click.countDocuments(filter);
			
			const pageInfo = setupPageInfo(total, perPage, readyArgs);
			
			return {
				nodes,
				pageInfo
			};
		},
		countClicks: async (_: any, args, {session, models: {click, link}}: IContext) => await click.countDocuments({linkId: args.linkId}) || 0,
	}
}