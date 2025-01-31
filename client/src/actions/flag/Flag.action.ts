"use server";

import {TResult} from "@type/data/response";
import {TLink} from "@type/data/link";

import {FLAG_LINK} from "./Flag.queries";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session-server";
import {revalidatePath} from "next/cache";

export const FlagAction = async (
    {link}: {link: TLink},
    state,
    formData: FormData
) => {
    // @todo Validate data
    const note = formData.get('note');

    // Set up mutation
    const res = await getClient().mutate({
        mutation: FLAG_LINK,
        variables: {
            input: {
                linkId: link.id,
                note: note,
            }
        },
        context: await getHeaders(),
        errorPolicy: 'all',
    });

    const data: TResult = res.data.flagLink.result;

    // Revalidate data
    revalidatePath('/inspect/[linkId]', 'layout')

    return data;
}