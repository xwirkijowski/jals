"use server";

import {REGISTER} from "./Register.query";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session-server";
import {createCookie} from "@lib/auth/session.cookies";
import {revalidatePath} from "next/cache";

export const RegisterAction = async (
    {email}: {email?: string},
    state,
    formData: FormData
) => {
    const code = formData.get('code');

    const {data: {register: data}} = await getClient().mutate({
        mutation: REGISTER,
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
    
    revalidatePath('/')

    return data;
}