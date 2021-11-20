export default `
	type Link {
		_id: ID!
		target: String!
		created: Timestamp!
		clicks: Int!
		flagCount: Int!
		flags: [LinkFlag!]
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
		): Link
		getLinks (
			page: Int
			perPage: Int
			target: String
		): LinkConnection!
	}
`;