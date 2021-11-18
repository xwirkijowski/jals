import {UserInputError} from "apollo-server";

export default {
	Link: {
		url: (root, _, {globals}) => {
			return `${globals.host}/${root._id}`;
		},
		clicks: (root, _, {dataSources}) => {
			return (async () => { return dataSources.click.countDocuments({link: root._id}); })();
		},
		flagCount: (root) => {
			return root.flags.length;
		}
	},
	LinkConnection: {
		edges: (root) => { return root.edges; },
		pageInfo: (root) => { return root.pageInfo; }
	},
	LinkEdge: {
		cursor: (root) => { return root._id; },
		node: (root) => { return root; }
	},
	Query: {
		getLink: (_, args, {dataSources}) => {
			return (async () => {
				return dataSources.link.findOne({_id: args._id});
			})();
		},
		getLinks: (_, args, {pagination, helpers, dataSources}) => {
			const paginationData = helpers.prepPagination(args, pagination)

			const query = {}
			if (args.target) query.$text.$search = args.target;

			return (async () => {
				const total = await dataSources.link.countDocuments(query);
				const pageCount = Math.ceil(total / paginationData.perPage);
				const data = (paginationData.page <= pageCount) ? await dataSources.link.find(query).limit(paginationData.perPage).skip(paginationData.skip) : []

				return {
					edges: data,
					pageInfo: helpers.constructPageInfo(total, pageCount, paginationData)
				}
			})();
		}
	},
	Mutation: {
		addLink: (_, {input}, {dataSources}) => {
			// @todo Check if input.target is not on blacklist

			const isValidUrl = (()=> {
				try {
					new URL(input.target);
				} catch (_) {
					return false;
				}

				return true
			})();

			if (!isValidUrl) throw new UserInputError('Please provide a valid target URL.', ['input', 'target'])

			input.created = new Date();

			return (async () => {
				return { link: dataSources.link.create(input) };
			})();
		},
		flagLink: (_, {input}, {dataSources}) => {
			const flag = {
				note: input.note,
				time: new Date()
			}

			return (async () => {
				return { link: (await dataSources.link.findOneAndUpdate({_id: input._id}, {$push: {flags: flag}}, {new: true})) };
			})();
		},
		removeLink: (_, {input}, {dataSources}) => {
			// @todo Check if admin

			return (async () => {
				return ((await dataSources.link.deleteOne({_id: input._id})).deletedCount === 1) ? { deletedId: input._id } : null;
			})();
		}
	}
}