import {UserInputError} from "apollo-server";

export default {
	Click: {
		link: (root, _, {dataSources}) => {
			return (async () => { return dataSources.link.findOne({_id: root.link})})();
		}
	},
	ClickConnection: {
		edges: (root) => { return root.edges; },
		pageInfo: (root) => { return root.pageInfo; }
	},
	ClickEdge: {
		cursor: (root) => { return root._id; },
		node: (root) => { return root; }
	},
	Query: {
		getClicks: (_, args, {pagination, helpers, dataSources}) => {
			const paginationData = helpers.prepPagination(args, pagination);

			const query = {}
			query.link = args.link;

			return (async () => {
				const total = await dataSources.click.countDocuments(query);
				const pageCount = Math.ceil(total / paginationData.perPage);
				const data = (paginationData.page <= pageCount) ? await dataSources.click.find(query).limit(paginationData.perPage).skip(paginationData.skip) : []

				return {
					edges: data,
					pageInfo: helpers.constructPageInfo(total, pageCount, paginationData)
				}
			})();
		},
		countClicks: (root, args, {dataSources}) => {
			const query = {}
			query.link = args.link;

			return (async () => { return dataSources.click.countDocuments(query); })();
		}
	},
	Mutation: {
		addClick: (_, {input}, {dataSources}) => {
			input.time = new Date();

			return (async () => {
				if (!(await dataSources.link.findOne({_id: input.link}))) throw new UserInputError("No links with this _id found.");

				return { click: dataSources.click.create(input) };
			})();
		},
		removeClick: (_, {input}, {dataSources}) => {
			// @todo Check if admin

			return (async () => {
				return ((await dataSources.link.deleteOne({_id: input._id})).deletedCount === 1) ? { deletedId: input._id } : null;
			})();
		},
		removeAllClicks: (_, {input}, {dataSources}) => {
			// @todo Check if admin

			return (async () => {
				return { deleted: ((await dataSources.link.delete({link: input.link})).deletedCount > 0) };
			})();
		}
	}
}