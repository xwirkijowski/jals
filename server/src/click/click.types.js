export default `
	type Click @cacheControl(maxAge: 30) {
		_id: ID!
		link: Link!
		time: Timestamp!
		platform: String!
		isMobile: Boolean!
	}
	
	type ClickConnection {
		edges: [Click]!
		pageInfo: PageInfo!
	}
	
	type ClickEdge {
		cursor: String!
		node: Click!
	}
	
	extend type Query {
		getClicks (
			page: Int
			perPage: Int
			link: ID!
		): ClickConnection!
		countClicks(
			link: ID!
		): Int!
	}
`;