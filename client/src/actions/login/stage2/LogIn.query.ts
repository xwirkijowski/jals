import {gql} from "@apollo/client";

export const LOG_IN = gql`
    mutation LogIn($input: LogInInput) {
        logIn(input: $input) {
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