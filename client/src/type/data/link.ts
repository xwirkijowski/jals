import {TResult} from "@type/data/response";

export type TLinkFlag = {
    note: string,
    createdAt: string,
}

export type TLink = {
    id: string,
    target: string,
    active: boolean,
    clickCount: number,
    flagCount: number,
    flags: Array<TLinkFlag>,
    createdAt: string,
    updatedAt: string,
    version: number,
};

export type TLinkMutationResponse = {
    link?: TLink,
    result?: TResult,
}