import {gql} from "@apollo/client";

export const REGISTER = gql`
    mutation Register($input: AuthInput) {
        register(input: $input) {
            result {
                success
                errors {
                    code
                    msg
                    path
                }
                errorCodes
            }
            sessionId
            user {
                id
                isAdmin
            }
        }
    }
`