import {gql} from "@apollo/client";

export const FLAG_LINK = gql`
    mutation FlagLink($input: FlagLinkInput!) {
        flagLink(input: $input) {
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