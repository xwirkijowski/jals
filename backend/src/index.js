import { makeExecutableSchema } from "@graphql-tools/schema";

import link from './link';

import { query, utils } from './types';
import { mutation } from './mutations';

export const schema = makeExecutableSchema({
	typeDefs: [
		query,
		mutation,
		utils,
		link.types
	],
	resolvers: [
		link.resolvers
	]
})

export const models = {
	link: link.model,
}