import {check, getIP, getUA, setupMeta} from "../../utilities/helpers";
import {Result} from "../result";

// Types
import {ContextInterface as CtxI} from "../../types/context.types";
import {HydratedClick} from "../../types/models/click.types";

// @todo Types

export default {
	Mutation: {
		createClick: async (_: any, {input}, {session, req, models: {click}}: CtxI) => {
			check.needs('mongo');
			const result = new Result();

			// If no User-Agent provided, try request
			if (!input.userAgent) input.userAgent = getUA(req) || null;
			// If no IP address provided, try request
			if (!input.ipAddress) input.ipAddress = getIP(req) || null;

			input = setupMeta(session, input);

			const node: HydratedClick = await click.create(input)

			if (node?._id) {
				return result.response(true, {click: node});
			} else {
				return result.addError('CREATE_CLICK_FAILED').response(true);
			}
		},
		removeClick: async (_: any, {input}, {session, models: {click}}: CtxI) => {
			check.needs('mongo');
			check.isAdmin(session);

			const result = new Result();

			const node = await click.deleteOne({_id: input.clickId});

			if (node.deletedCount === 1) {
				return result.response(true)
			} else {
				return result.addError('REMOVE_CLICK_FAILED').response(true);
			}
		},
		removeAllClicks: async (_: any, {input}, {session, models: {click, link}}: CtxI) => {
			check.needs('mongo');
			check.isOwner(session, await link.findOne({_id: input.linkId}));

			const result = new Result();

			const nodeCounts: number = await click.countDocuments({linkId: input.linkId});
			const node = await click.deleteMany({linkId: input.linkId});

			if (nodeCounts === node.deletedCount) {
				return result.response(true, {deletedCount: node.deletedCount});
			} else {
				return result.addError('REMOVE_CLICK_ALL_FAILED').response(true);
			}
		}
	},
}