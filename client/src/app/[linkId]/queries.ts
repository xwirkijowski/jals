import { gql } from "@apollo/client";

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