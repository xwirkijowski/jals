import {check, getIP, setupMeta} from "../../utilities/helpers.js";
import {Result} from "../../utilities/result.js";

export default {
	Mutation: {
		createClick: async (_, {input}, {session, req, models: {click}}) => {
			check.needs('mongo');
			const result = new Result();

			// If no User-Agent provided, try request
			if (!input.userAgent) input.userAgent = req.get('User-Agent').normalize('NFKD') || null;
			// If no IP address provided, try request
			if (!input.ipAddress) input.ipAddress = getIP(req) || null;

			input = setupMeta(session, input);

			const node = await click.create(input)

			if (node?._id) {
				return result.response(true, {click: node});
			} else {
				return result.addError('CREATE_CLICK_FAILED').response(true);
			}
		},
		removeClick: async (_, {input}, {session, models: {click}}) => {
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
		removeAllClicks: async (_, {input}, {session, models: {click, link}}) => {
			check.needs('mongo');
			check.isOwner(session, await link.findOne({_id: input.linkId}));

			const result = new Result();

			const nodeCounts = await click.countDocuments({linkId: input.linkId});
			const node = await click.deleteMany({linkId: input.linkId});

			if (nodeCounts === node.deletedCount) {
				return result.response(true, {deletedCount: node.deletedCount});
			} else {
				return result.addError('REMOVE_CLICK_ALL_FAILED').response(true);
			}
		}
	},
}