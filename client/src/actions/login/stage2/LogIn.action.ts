"use server";

import {LOG_IN} from "./LogIn.queries";
import {getClient} from "../../../apollo-client";
import {ResponseType} from "@type/data/Response";

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
        }
    })

    return data;
}