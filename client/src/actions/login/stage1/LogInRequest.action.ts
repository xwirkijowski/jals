"use server";

import {REQUEST_AUTH_CODE} from "@act/shared/auth/shared.auth.query";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session";

export const LogInRequestAction = async (
    state: ResponseType,
    formData: FormData
) => {
    const email = formData.get('email');

    const res = await getClient().mutate({
        mutation: REQUEST_AUTH_CODE,
        variables: {
            input: {
                email: email,
                action: 'LOGIN',
            }
        },
        context: await getHeaders(),
        errorPolicy: 'all',
    })

    const data = res.data.requestAuthCode;

    return {
        ...data,
        email
    };
}