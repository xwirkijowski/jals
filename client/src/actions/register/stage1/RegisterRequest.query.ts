import {gql} from "@apollo/client";

export const REQUEST_REGISTER = gql`
    mutation RequestRegister($input: RequestRegisterInput) {
        requestRegister (input: $input) {
            result {
                success
                errors {
                    path
                    msg
                    code
                }
                errorCodes
            }
        }
    }
`