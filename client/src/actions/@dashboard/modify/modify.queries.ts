import {gql} from "@apollo/client";

export const UPDATE_LINK = gql`
    mutation UpdateLink($input: UpdateLinkInput!) {
        updateLink(input: $input) {
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