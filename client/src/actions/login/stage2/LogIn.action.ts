"use server";

import {LOG_IN} from "./LogIn.query";
import {getClient} from "../../../lib/apollo-client";
import {ResponseType} from "@type/data/Response";
import {createSession, getSessionContext} from "../../../lib/auth/session";

export const LogInAction = async (
    {email}: {email?: string},
    state: ResponseType,
    formData: FormData
) => {
    const code = formData.get('code');

    const {data: {logIn: data}} = await getClient().mutate({
        mutation: LOG_IN,
        variables: {
            input: {
                email: email,
                code: code
            }
        },
        context: await getSessionContext(),
    })

    if (data && data?.result?.success === true && data?.sessionId) {
        await createSession(data)
    }

    return data;
}