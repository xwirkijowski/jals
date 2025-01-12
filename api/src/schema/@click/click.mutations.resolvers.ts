import {check, getIP, getUA, setupMeta} from "../../utilities/helpers";
import {Result} from "../result";

// Types
import {IContext} from "../../types/context.types";
import {THydratedClick} from "../../models/click.types";
import {InternalError} from "../../utilities/errors";

// @todo Types

export default {
	Mutation: {
		createClick: async (_: any, {input}, {session, req, models: {click, link}}: IContext) => {
			check.needs('mongo');

			const result = new Result();

			// If no User-Agent provided, try request
			if (!input.userAgent) input.userAgent = getUA(req) || null;
			// If no IP address provided, try request
			if (!input.ipAddress) input.ipAddress = getIP(req) || null;

			input = setupMeta(session, input);

			const node: THydratedClick = await click.create(input)

			const linkNode_update = await link.updateOne({_id: node.linkId}, {$inc: {'clickCount': 1}});
			if (linkNode_update.acknowledged !== true || linkNode_update.modifiedCount !== 1) {
				result.addError('LINK_UPDATE_FAILED', undefined,  'Could not update click count');
				new InternalError('Unexpected problem with database operation', 'DB_OPERATION_FAILED', 'Resolvers', true, linkNode_update);
			}

			if (node?._id) {
				return result.response(true, {click: node});
			} else {
				return result.addError('CREATE_CLICK_FAILED').response(true);
			}
		},
		removeClick: async (_: any, {input}, {models: {click}}: IContext) => {
			check.needs('mongo');

			const result = new Result();

			const node = await click.deleteOne({_id: input.clickId});

			if (node.deletedCount === 1) {
				return result.response(true)
			} else {
				new InternalError('Unexpected problem with database operation', 'DB_OPERATION_FAILED', 'Resolvers', true, node);
				return result.addError('REMOVE_CLICK_FAILED').response(true);
			}
		},
		removeAllClicks: async (_: any, {input}, {models: {click}}: IContext) => {
			check.needs('mongo');

			const result = new Result();

			const nodeCounts: number = await click.countDocuments({linkId: input.linkId});
			const node = await click.deleteMany({linkId: input.linkId});

			if (nodeCounts === node.deletedCount) {
				return result.response(true, {deletedCount: node.deletedCount});
			} else {
				new InternalError('Unexpected problem with database operation', 'DB_OPERATION_FAILED', 'Resolvers', true, node);
				return result.addError('REMOVE_CLICK_ALL_FAILED').response(true);
			}
		}
	},
}