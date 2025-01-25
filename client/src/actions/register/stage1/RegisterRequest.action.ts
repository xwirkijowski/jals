"use server";

import {REQUEST_AUTH_CODE} from "@act/shared/auth/shared.auth.query";
import {getClient} from "@lib/apolloClient";
import {getHeaders} from "@lib/auth/session";

export const RegisterRequestAction = async (
    state,
    formData: FormData
) => {
    const email = formData.get('email');

    const {data: {requestAuthCode: data}} = await getClient().mutate({
        mutation: REQUEST_AUTH_CODE,
        variables: {
            input: {
                email: email,
                action: 'REGISTER',
            }
        },
        context: await getHeaders(),
        errorPolicy: 'all',
    })

    return {
        ...data,
        email
    };
}