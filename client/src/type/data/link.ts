import {TResult} from "@type/data/response";
import {TUser} from "@ctx/auth/auth.types";

export type TLinkFlag = {
    note: string,
    createdAt: string,
}

export type TLink = {
    id: string,
    target: string,
    active: boolean,
    caution: boolean,
    clickCount: number,
    flagCount: number,
    flags: Array<TLinkFlag>,
    createdAt: string,
    createdBy?: TUser
    updatedAt: string,
    version: number,
};

export type TLinkMutationResponse = {
    link?: TLink,
    result?: TResult,
}