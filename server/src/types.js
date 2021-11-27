export const query = `
	type Query {
		_empty: String
	}
`

export const utils = `
	enum CacheControlScope {
		PUBLIC
		PRIVATE
	}
	
	directive @cacheControl(
		maxAge: Int
		scope: CacheControlScope
		inheritMaxAge: Boolean
	) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

	scalar Timestamp
	
	type PageInfo {
		total: Int!
		perPage: Int!
		pageCount: Int!
		currentPage: Int!
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
	}
`;