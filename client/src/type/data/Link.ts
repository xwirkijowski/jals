import {FlagType} from "@type/data/Flag";

export type LinkType = {
    id: string,
    target: string,
    active: boolean,
    clickCount: number,
    flagCount: number,
    flags: Array<FlagType>,
    createdAt: string,
    updatedAt: string,
    version: number,
};