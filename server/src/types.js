export const query = `
	type Query {
		_empty: String
	}
`

export const utils = `
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