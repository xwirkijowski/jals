export default `
	input ClickInput {
		link: ID!
		platform: String!
		isMobile: Boolean!
	}
	
	type AddClickPayload {
		click: Click
	}
	
	input RemoveClickInput {
		_id: ID!
	}
	
	type RemoveClickPayload {
		deletedId: ID
	}
	
	input RemoveAllClicksInput {
		link: ID!
	}
	
	type RemoveAllClicksPayload {
		deleted: Boolean
	}
	
	extend type Mutation {
		addClick(input: ClickInput): AddClickPayload
		removeClick(input: RemoveClickInput): RemoveClickPayload
		removeAllClicks(input: RemoveAllClicksInput): RemoveAllClicksPayload
	}
`;