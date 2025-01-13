import {gql} from "@apollo/client";

export const CURRENT_SESSION = gql`
    query {
        currentSession {
            user {
                id
                email
                isAdmin
                version
            }
            id
            version
        }
    }
`;
