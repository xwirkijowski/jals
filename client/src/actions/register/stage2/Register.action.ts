"use server";

import {REGISTER} from "./Register.query";
import {getClient} from "../../../lib/apollo-client";
import {ResponseType} from "@type/data/Response";
import {getSessionHeader} from "../../../lib/auth/session";

export const RegisterAction = async (
    {email}: {email?: string},
    state: ResponseType,
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
        context: await getSessionHeader(true),
    })

    return data;
}