"use server";

import {CREATE_LINK} from "./Shorten.query";
import {LinkMutationDataType} from "@type/data/MutationData";
import {getClient} from "../../apollo-client";

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
        }
    });

    return data;
}