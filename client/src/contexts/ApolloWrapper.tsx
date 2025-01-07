"use client";

import React from "react";
import { HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

function makeClient() {
    return new ApolloClient({
        cache: new InMemoryCache({ addTypename: false }),
        link: new HttpLink({
            uri: "http://10.0.10.10:4010/",
        }),
    });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}