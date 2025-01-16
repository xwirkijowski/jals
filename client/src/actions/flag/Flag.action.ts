"use server";

import {LinkType} from "@type/data/Link";

import {FLAG_LINK} from "./Flag.queries";
import {LinkMutationDataType} from "@type/data/MutationData";
import {getClient} from "../../lib/apollo-client";
import {getSessionHeader} from "../../lib/auth/session";


export const FlagAction = async (
    {link}: {link: LinkType},
    state: LinkMutationDataType,
    formData: FormData
) => {
    // @todo Validate data
    const note = formData.get('note');

    // Set up mutation
    const {data: {flagLink: data}} = await getClient().mutate({
        mutation: FLAG_LINK,
        variables: {
            input: {
                linkId: link.id,
                note: note,
            }
        },
        context: await getSessionHeader(true),
    });

    return data;
}