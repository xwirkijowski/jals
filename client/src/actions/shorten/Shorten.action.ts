"use server";

import {CREATE_LINK} from "./Shorten.query";
import {LinkMutationDataType} from "@type/data/MutationData";
import {getClient} from "../../lib/apollo-client";
import {getSessionHeader} from "../../lib/auth/session";

export const ShortenAction = async (
    state: LinkMutationDataType,
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
        context: await getSessionHeader(true),
    });

    return data;
}