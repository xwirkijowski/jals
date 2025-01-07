import { check } from "../../utilities/helpers";

// Types
import {ContextInterface as CtxI} from "../../types/context.types";

// @todo Types

export default {
	Click: {
		link: async (obj, _, {models: {link}}: CtxI) => {
			return (async () => { return await link.findOne({_id: obj.linkId})})();
		},
		ipAddress: (obj, _, {session}: CtxI) => {
			return check.isAdmin(session) ? obj.ipAddress : null;
		},
		createdBy: async (obj, _, {session, models: {user}}: CtxI) => {
			check.isAdmin(session);
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
		click: async (_: any, args, {session, models: {click}}: CtxI) => {
			check.isAdmin(session);
			return await click.findOne({_id: args.clickId});
		},
		clicks: async (_: any, args, {session, models: {click, link}}: CtxI) => {
			check.session(session);
			check.isOwner(session, await link.findOne({_id: args.linkId}));

			const clicks = await click.find({linkId: args.linkId})

			return clicks;
		},
		countClicks: async (_: any, args, {session, models: {click, link}}: CtxI) => {
			check.session(session);
			check.isOwner(session, await link.findOne({_id: args.linkId}));

			return await click.countDocuments({linkId: args.linkId});
		},
	}
}