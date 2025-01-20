import {gql} from "@apollo/client";

export const LOG_OUT = gql`
    mutation {
        logOut {
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
`