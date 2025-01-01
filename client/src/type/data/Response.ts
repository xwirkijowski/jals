import {MutationDataType} from "@type/data/MutationData";
import {LinkType} from "@type/data/Link";
import {FlagType} from "@type/data/Flag";

export type ResponseType = {
    data: MutationDataType|LinkType|FlagType,
    extensions?: {
        requestId?: string,
        auth?: 'invalid'|boolean,
    }
}