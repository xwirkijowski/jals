// @todo Remove clickLink when linkData ready

export default `
	input LinkInput {
		target: String!
	}
	
	type AddLinkPayload {
		link: Link
	}
	
	input RemoveLinkInput {
		_id: ID!
	}
	
	type RemoveLinkPayload {
		deletedId: ID
	}

	input ClickLinkInput {
		_id: ID!
	}
	
	type ClickLinkPayload {
		clickedId: ID
	}

	extend type Mutation {
		addLink(input: LinkInput!): AddLinkPayload
		removeLink(input: RemoveLinkInput!): RemoveLinkPayload
		clickLink(input: ClickLinkInput!): ClickLinkPayload
	}
`;