"use client";

import {Context, createContext} from "react";

type Flag = {
    note: string,
    createdAt: string,
}

type DataInterface = {
    link?: {
        id: string,
        target: string,
        active: boolean,
        clickCount: number,
        flagCount: number,
        flags: Array<Flag>,
        createdAt: string,
        updatedAt: string,
        version: number,
    },
    result?: {
        success: boolean,
        errors: Array<object>,
        errorCodes: Array<string>,
    },
}

export const LinkContext: Context<any> = createContext(null);

export const LinkContextWrapper = ({value, children}) => {
    return (
        <LinkContext.Provider value={value}>
            {children}
        </LinkContext.Provider>
    )
}