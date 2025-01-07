import {gql} from "@apollo/client";

export const REQUEST_AUTH_CODE = gql`
    mutation RequestAuthCode($input: RequestAuthCodeInput) {
        requestAuthCode (input: $input) {
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