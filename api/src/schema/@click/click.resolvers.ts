import {check} from "@util/helpers";

// Types
import {IContext} from "@type/context.types";
import {THydratedClick} from "@model/click.types";
import {THydratedLink} from "@model/link.types";

// @todo Types

export default {
	Click: {
		// Return associated link document
		link: async (obj: THydratedClick, _: any, {models: {link}}: IContext): Promise<THydratedLink|null> => (obj.linkId) ? await link.findOne({_id: obj.linkId}) : null,
		// Return owner user document
		createdBy: async (obj: THydratedClick, _: any, {models: {user}}: IContext): Promise<string|null> => {
			return (obj.createdBy)
				? user.findOne({_id: obj.createdBy})
				: null;
		},
	},
	ClickConnection: {
		edges: (obj) => { return obj.edges; },
		pageInfo: (obj) => { return obj.pageInfo; }
	},
	ClickEdge: {
		cursor: (obj) => { return obj._id; },
		node: (obj) => { return obj; }
	},
	Query: {
		click: async (_: any, args, {models: {click}}: IContext) => await click.findOne({_id: args.clickId}),
		clicks: async (_: any, args, {session, models: {click, link}}: IContext) => {
			check.session(session);
			check.isOwner(session, await link.findOne({_id: args.linkId}));

			return await click.find({linkId: args.linkId});
		},
		countClicks: async (_: any, args, {session, models: {click, link}}: IContext) => await click.countDocuments({linkId: args.linkId}) || 0,
	}
}