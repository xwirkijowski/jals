"use server";

import {REGISTER} from "./Register.query";
import {getClient} from "../../../apollo-client";
import {ResponseType} from "@type/data/Response";

export const RegisterAction = async (
    {email}: {email?: string},
    state: ResponseType,
    formData: FormData
) => {
    const code = formData.get('code');

    const {data: {logIn: data}} = await getClient().mutate({
        mutation: REGISTER,
        variables: {
            input: {
                email: email,
                code: code
            }
        }
    })

    return data;
}