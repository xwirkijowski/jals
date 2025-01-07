"use server";

import {REQUEST_REGISTER} from "./RegisterRequest.query";
import {getClient} from "../../../apollo-client";
import {ResponseType} from "@type/data/Response";

export const RegisterRequestAction = async (
    state: ResponseType,
    formData: FormData
) => {
    const email = formData.get('email');

    const {data: {requestAuthCode: data}} = await getClient().mutate({
        mutation: REQUEST_REGISTER,
        variables: {
            input: {
                email: email,
            }
        }
    })

    return {
        ...data,
        email
    };
}