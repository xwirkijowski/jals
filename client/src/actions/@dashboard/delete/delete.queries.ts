import {gql} from "@apollo/client";

export const DELETE_LINK = gql`
    mutation DeleteLink($input: DeleteLinkInput!) {
        deleteLink(input: $input) {
            result {
                success
                errors {
                    code
                    msg
                    path
                }
                errorCodes
            }
        }
    }
`;