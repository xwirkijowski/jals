// ./ApolloClient
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

export const { getClient, query } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache({ addTypename: false }),
        link: new HttpLink({
            uri: "http://10.0.10.10:4010/",
        }),

    });
});