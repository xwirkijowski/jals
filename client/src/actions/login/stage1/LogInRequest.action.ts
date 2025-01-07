"use server";

import {REQUEST_AUTH_CODE} from "./LogInRequest.query";
import {getClient} from "../../../apollo-client";
import {ResponseType} from "@type/data/Response";

export const LogInRequestAction = async (
    state: ResponseType,
    formData: FormData
) => {
    const email = formData.get('email');

    const {data: {requestAuthCode: data}} = await getClient().mutate({
        mutation: REQUEST_AUTH_CODE,
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