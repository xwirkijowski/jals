import {LinkMutationDataType} from "@type/data/MutationData";
import {LinkType} from "@type/data/Link";
import {FlagType} from "@type/data/Flag";
import {ResultType} from "@type/data/Result";

export type ResponseType = {
    data: LinkMutationDataType|LinkType|FlagType|ResultType,
    extensions?: {
        requestId?: string,
        auth?: 'invalid'|boolean,
    }
}