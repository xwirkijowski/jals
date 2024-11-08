const f = {};

/**
 * Prepares basic pagination information needed for
 * database queries
 *
 * @author	Sebastian Wirkijowski <sebastian@wirkijowski.dev>
 *
 * @param 	args		object	Arguments from the GraphQL query.
 * @param 	pagination	object	GraphQL shared query context pagination field.
 *
 * @returns	{{
 * 		perPage: number,
 * 		page: number,
 * 		skip: number
 * }}					object	Basic pagination data user for queries.
 */
f.prepPagination = (args, pagination) => {
	return {
		perPage: (args.perPage && typeof args.perPage === 'number' && args.perPage > 0 && args.perPage <= pagination.perPageMax) ? args.perPage : pagination.perPageDefault,
		page: (args.page && typeof args.page === 'number' && args.page > 0) ? args.page : 1,
		get skip () { return this.perPage * (this.page - 1) }
	}
}

export default f;