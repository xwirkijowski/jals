"use client";

import React from "react";
import {HttpLink} from "@apollo/client";
import {
	ApolloNextAppProvider,
	ApolloClient,
	InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

function makeClient () {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_CLIENT_API_STRING,
	});
	
	const cache = new InMemoryCache({ addTypename: false });
	
	return new ApolloClient({
		cache,
		link: httpLink,
		defaultOptions: {
			query: {
				errorPolicy: "all"
			}
		}
	});
}

export function ApolloWrapper ({children}: React.PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	)
}