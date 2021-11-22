export const resolvers = {
	PageInfo: {
		total: ({total}) => { return total; },
		perPage: ({paginationData}) => { return paginationData.perPage },
		pageCount: ({pageCount}) => { return pageCount },
		currentPage: ({paginationData}) => { return paginationData.page },
		hasNextPage: ({paginationData, pageCount}) => { return (paginationData.page < pageCount) },
		hasPreviousPage: ({paginationData, pageCount}) => { return (paginationData.page <= pageCount + 1 && paginationData.page > 1) }
	}
}