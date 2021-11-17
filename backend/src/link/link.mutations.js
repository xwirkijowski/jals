export default `
	input LinkInput {
		target: String!
	}
	
	type AddLinkPayload {
		link: Link
	}

	input FlagLinkInput {
		_id: ID!
	}
	
	type FlagLinkPayload {
		link: Link
	}
	
	input RemoveLinkInput {
		_id: ID!
	}
	
	type RemoveLinkPayload {
		deletedId: ID
	}

	extend type Mutation {
		addLink(input: LinkInput!): AddLinkPayload
		flagLink(input: FlagLinkInput!): FlagLinkPayload
		removeLink(input: RemoveLinkInput!): RemoveLinkPayload 
	}
`;