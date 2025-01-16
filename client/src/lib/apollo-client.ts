import {ApolloLink, from, HttpLink} from "@apollo/client";
import {
    registerApolloClient,
    ApolloClient,
    InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import {getCookie, refreshCookie, deleteCookie} from "./auth/session.cookies";
import { asyncMap } from "@apollo/client/utilities";

const authManagerMiddleware = new ApolloLink((operation, forward) => {
    return asyncMap(forward(operation), async data => {
        if (data?.extensions && data?.extensions?.auth) {
            const auth = data.extensions.auth;
            const session = await getCookie();

            if (session) {
                if (auth === 'invalid') {
                    await deleteCookie();
                } else if (auth === session?.sessionId) {
                    await refreshCookie();
                }
            }
        }

        return data;
    })
})

// @todo Implement on error (unauthenticated) middleware, delete session on unauthorized

const httpLink = new HttpLink({
    uri: "http://10.0.10.10:4010/",
});

const cache = new InMemoryCache({ addTypename: false });

export const { getClient, query } = registerApolloClient(() => {
    return new ApolloClient({
        cache,
        link: from([authManagerMiddleware, httpLink]),
    });
});