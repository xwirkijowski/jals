import {gql} from "@apollo/client";

export const CURRENT_USER = gql`
    query {
        currentUser {
            id
            email
            isAdmin
            version
        }
    }
`;

export const CURRENT_SESSION = gql`
    query {
        currentSession {
            id
            isAdmin
        }
    }
`;