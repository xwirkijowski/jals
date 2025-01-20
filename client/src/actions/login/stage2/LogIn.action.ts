"use server";

import {LOG_IN} from "./LogIn.query";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session";
import {createCookie} from "@lib/auth/session.cookies";
import {revalidatePath} from "next/cache";

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
                code: code,
            }
        },
        context: await getHeaders(),
        errorPolicy: 'all',
    })

    // Create session cookie
    if (data && data?.result?.success === true && data?.sessionId) {
        await createCookie(data)
    }

    // Refresh layout
    revalidatePath('/', 'layout')

    return data;
}