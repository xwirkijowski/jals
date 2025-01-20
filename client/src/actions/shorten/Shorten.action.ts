"use server";

import {CREATE_LINK} from "./Shorten.query";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session";

export const ShortenAction = async (
    state,
    formData: FormData
) => {
    // @todo Validate data
    const target = formData.get('target');

    // Set up mutation

    const {data: {createLink: data}} = await getClient().mutate({
        mutation: CREATE_LINK,
        variables: {
            input: {
                target: target,
            }
        },
        context: await getHeaders(),
        errorPolicy: 'all',
    });

    return data;
}