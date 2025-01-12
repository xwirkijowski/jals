import { check, setupMeta } from "../../utilities/helpers";
import { Result } from "../result";

// Types
import {IContext} from "../../types/context.types";
import {THydratedLink, ILink} from "../../models/link.types";
import {TSession} from "../../services/auth/session";
import {InternalError} from "../../utilities/errors";

export default {
	Mutation: {
		createLink: async (_, {input}, {models, session, internal: {requestId}}: IContext) => {
			check.needs('mongo');

			const result = new Result();

			// Validate required input fields
			check.validate(input, 'object');
			check.validate(input.target, 'string');

			// Normalize user input
			input.target = input.target.normalize('NFKD');
			input.active = true;

			// Validate target as URL

			setupMeta(session, input);

			const node: THydratedLink = await models.link.create(input)

			if (node?._id) {
				return result.response(true, { link: node });
			} else {
				return result.addError('CREATE_LINK_FAILED').response(true);
			}
		},
		updateLink: async (_, {input}, {models, session, internal: {requestId}}: IContext) => {
			check.needs('mongo');
			check.needs('redis');

			const result = new Result();

			// Validate required input fields
			check.validate(input, 'object');
			check.validate(input.linkId, 'ObjectId');

			let node: THydratedLink = await models.link.findOne({_id: input.linkId});

			if (!node) return result.addError('LINK_NOT_FOUND', 'input.linkId', 'Could not find a link with specified Id.').response(true);

			check.isOwner(session, node.createdBy);

			if (check.validate(input.target, 'string', true)) node.target = input.target;
			if (check.validate(input.active, 'boolean', true)) node.active = input.active;

			setupMeta(session, input, node)

			const node_update = await models.link.updateOne((node as ILink));

			if (node_update.acknowledged === true && node_update.modifiedCount === 1) {
				return result.response(true, { link: node });
			} else {
				new InternalError('Unexpected problem with database operation', 'DB_OPERATION_FAILED', 'Resolvers', true, node_update);
				return result.addError('UPDATE_LINK_FAILED').response(true);
			}
		},
		deleteLink: async (_, {input}, {models, session, internal: {requestId}}: IContext) => {
			check.needs('mongo');
			check.needs('redis');

			const result = new Result();

			// Validate required input fields
			check.validate(input, 'object');
			check.validate(input.linkId, 'ObjectId');

			let node: THydratedLink = await models.link.findOne({_id: input.linkId});

			if (!node) return result.addError('LINK_NOT_FOUND', 'input.linkId', 'Could not find a link with specified Id.').response(true);

			check.isOwner(session, node.createdBy);

			const node_delete = await models.link.deleteOne({_id: node.id});

			if (node_delete.acknowledged === true && node_delete.deletedCount === 1) {
				return result.response(true)
			} else {
				new InternalError('Unexpected problem with database operation', 'DB_OPERATION_FAILED', 'Resolvers', true, node_delete);
				return result.addError('DELETE_LINK_FAILED').response(true);
			}
		},
		flagLink: async (_, {input}, {models, session, internal: {requestId}}: IContext) => {
			check.needs('mongo');

			const result = new Result();

			check.validate(input, 'object');
			check.validate(input.linkId, 'ObjectId');
			check.validate(input.note, 'string');

			let node = await models.link.findOne({_id: input.linkId});

			if (!node) return result.addError('LINK_NOT_FOUND', 'input.linkId', 'Could not find a link with specified Id.').response(true);

			node = setupMeta(session, undefined, node)

			const node_update = await models.link.updateOne({_id: node._id}, {
				$push: {
					flags: {
						note: input.note,
						createdBy: (session as TSession)?.userId||null,
						createdAt: new Date().toISOString(),
					}
				},
				updatedBy: node.updatedBy,
				updatedAt: node.updatedAt,
				version: node.version,
			})

			if (node_update.acknowledged === true && node_update.modifiedCount === 1) {
				return result.response(true, { link: node });
			} else {
				new InternalError('Unexpected problem with database operation', 'DB_OPERATION_FAILED', 'Resolvers', true, node_update);
				return result.addError('FLAG_LINK_FAILED').response(true);
			}
		},
	}
}