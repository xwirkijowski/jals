"use server"

import {query} from '@lib/apollo-client';
import {getHeaders} from "@lib/auth/session-server";

import {LINK_FULL, LINK_OWNER, LINK_PUBLIC, LINK_REDIRECT} from "@ctx/link/link.queries";

import {ApolloQueryResult} from "@apollo/client";

export async function fetchLink (linkId: string, context:string = 'public'): Promise<ApolloQueryResult<any>> {
	const headers = await getHeaders();
	
	const queries = {
		redirect: LINK_REDIRECT,
		public: LINK_PUBLIC,
		owner: LINK_OWNER,
		admin: LINK_FULL,
	}
	
	const selectedQuery = queries[context] ? queries[context] : queries['public'];
	
	return await query({
		query: selectedQuery,
		variables: {linkId: linkId},
		context: headers
	});
}