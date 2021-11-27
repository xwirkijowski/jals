export default `
	type Link @cacheControl(maxAge: 30) {
		_id: ID!
		target: String!
		created: Timestamp!
		clicks: Int! @cacheControl(maxAge: 5)
		flagCount: Int! @cacheControl(maxAge: 5)
		flags: [LinkFlag!] @cacheControl(maxAge: 5)
	}
	
	type LinkFlag {
		note: String!
		time: Timestamp!
	}
	
	type LinkConnection {
		edges: [Link]!
		pageInfo: PageInfo!
	}
	
	type LinkEdge {
		cursor: String!
		node: Link!
	}
	
	extend type Query {
		getLink (
			_id: ID!
		): Link @cacheControl(maxAge: 30)
		getLinks (
			page: Int
			perPage: Int
			target: String
		): LinkConnection!
	}
`;