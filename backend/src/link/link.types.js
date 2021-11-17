export default `
	type Link {
		_id: ID!
		target: String!
		url: String!
		created: Timestamp!
		clicks: Int!
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
		getAllLinks: [Link]
	}
`;