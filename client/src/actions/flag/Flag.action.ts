"use server";

import {LinkType} from "@type/data/Link";

import {FLAG_LINK} from "./Flag.queries";
import {LinkMutationDataType} from "@type/data/MutationData";
import {getClient} from "../../apollo-client";


export const FlagAction = async (
    {mode, link}: {mode: string, link: LinkType},
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
        }
    });

    return data;
}