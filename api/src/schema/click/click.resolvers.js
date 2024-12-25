import { Result } from "../../utilities/result.js";
import { check, getIP, setupMeta } from "../../utilities/helpers.js";

export default {
	Click: {
		link: async (obj, _, {models: {link}}) => {
			return (async () => { return await link.findOne({_id: obj.linkId})})();
		},
		ipAddress: (obj, _, {session}) => {
			return check.isAdmin(session) ? obj.ipAddress : null;
		},
		createdBy: async (obj, _, {session, models: {user}}) => {
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
		click: async (_, args, {session, models: {click}}) => {
			check.isAdmin(session);
			return await click.findOne({_id: args.clickId});
		},
		clicks: async (_, args, {session, models: {click, link}}) => {
			check.session();
			check.isOwner(session, await link.findOne({_id: args.linkId}));

			const clicks = await click.find({linkId: args.linkId})

			return clicks;
		},
		countClicks: async (_, args, {session, models: {click, link}}) => {
			check.session();
			check.isOwner(session, await link.findOne({_id: args.linkId}));

			return await click.countDocuments({linkId: args.linkId});
		},
	},
	Mutation: {
		addClick: async (_, {input}, {session, req, models: {click}}) => {
			check.needs('db');
			const result = new Result();

			// If no User-Agent provided, try request
			if (!input.userAgent) input.userAgent = req.get('User-Agent').normalize('NFKD') || null;
			// If no IP address provided, try request
			if (!input.ipAddress) input.ipAddress = getIP(req) || null;

			input = setupMeta(session, input);

			const node = await click.create(input)

			if (node) { // @todo: Add proper checks
				return result.response(true, {click: node});
			} else {
				return {
					result: false
				}
			}
		},
		removeClick: async (_, {input}, {session, models: {click}}) => {
			check.needs('db');
			check.isAdmin(session);
			const result = new Result();

			const node = await click.deleteOne({_id: input.clickId});

			if (node.deletedCount === 1) {
				return result.response(true)
			} else {
				return {
					result: false
				}
			}
		},
		removeAllClicks: async (_, {input}, {session, models: {click, link}}) => {
			check.needs('db');
			check.isOwner(session, await link.findOne({_id: input.linkId}));
			const result = new Result();

			const nodeCounts = await click.countDocuments({linkId: input.linkId});
			const node = await click.deleteMany({linkId: input.linkId});

			if (nodeCounts === node.deletedCount) {
				return result.response(true, {deletedCount: node.deletedCount});
			} else {
				return {
					result: false
				}
			}
		}
	},
}