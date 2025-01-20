import {TLink} from "@type/data/link";

export type TResult = {
    success: boolean,
    errors: Array<object>,
    errorCodes: Array<string>,
}

export type TResponse = {
    data?: {
        link?: TLink,
        result?: TResult,
    },
    extensions?: {
        requestId?: string,
        auth?: 'invalid'|boolean,
    }
}