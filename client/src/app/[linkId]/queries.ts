import { gql } from "@apollo/client";

export const GET_LINK = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            flagCount
            caution
        }
    }
`;
export const CLICK_ADD = gql`
    mutation ($input: CreateClickInput) {
        createClick(input: $input) {
            result {
                success
                errors {
                    path
                    msg
                    code
                }
            }
        }
    }
`;