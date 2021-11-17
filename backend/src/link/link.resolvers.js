export default {
	Link: {
		// @todo Resolve clicks by counting logs related to Link when linkData ready

		url: (root, _, {globals}) => {
			return `${globals.host}/${root._id}`;
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
		getLink: (root, args, {dataSources}) => {
			return (async () => {
				return dataSources.link.findOne({_id: args.input._id});
			})();
		},
		getLinks: (root, args, {pagination, helpers, dataSources}) => {
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
		},
		getAllLinks: (root, _, {dataSources}) => {
			return (async () => {
				return dataSources.link.find();
			})();
		}
	},
	Mutation: {
		addLink: (root, {input}, {dataSources}) => {
			// @todo Check if input.target is valid and not on blacklist

			input.created = new Date();
			input.clicks = 0

			return (async () => {
				return { link: dataSources.link.create(input) };
			})();
		},
		clickLink: (root, {input}, {dataSources}) => {
			// @todo Remove when linkData ready

			return (async () => {
				return { clickedId: (await dataSources.link.findOneAndUpdate({_id: input._id}, {$inc: {clicks: 1}}))._id };
			})();
		},
		removeLink: (root, {input}, {dataSources}) => {
			// @todo Check if admin

			return (async () => {
				return ((await dataSources.link.deleteOne({_id: input._id})).deletedCount === 1) ? { deletedId: input._id } : null;
			})();
		}
	}
}