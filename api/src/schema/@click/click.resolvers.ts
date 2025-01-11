import {check} from "../../utilities/helpers";

// Types
import {ContextInterface as CtxI} from "../../types/context.types";
import {HydratedClick} from "../../types/models/click.types";
import {HydratedLink} from "../../types/models/link.types";

// @todo Types

export default {
	Click: {
		// Return associated link document
		link: async (obj: HydratedClick, _: any, {models: {link}}: CtxI): Promise<HydratedLink|null> => (obj.linkId) ? await link.findOne({_id: obj.linkId}) : null,
		// Return owner user document
		createdBy: async (obj: HydratedClick, _: any, {models: {user}}: CtxI): Promise<string|null> => {
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
		click: async (_: any, args, {models: {click}}: CtxI) => await click.findOne({_id: args.clickId}),
		clicks: async (_: any, args, {session, models: {click, link}}: CtxI) => {
			check.session(session);
			check.isOwner(session, await link.findOne({_id: args.linkId}));

			return await click.find({linkId: args.linkId});
		},
		countClicks: async (_: any, args, {session, models: {click, link}}: CtxI) => await click.countDocuments({linkId: args.linkId}) || 0,
	}
}