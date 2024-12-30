import {gql} from "@apollo/client";

export const CREATE_LINK = gql`
    mutation CreateLink($input: CreateLinkInput!) {
        createLink(input: $input) {
            result {
                success
                errors {
                    code
                    msg
                    path
                }
            }
            link {
                id
                target
            }
        }
    }
`;