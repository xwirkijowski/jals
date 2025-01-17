"use client";

import {Context, createContext, ReactNode} from "react";

import {ResponseType} from '@type/data/Response';

export const LinkContext: Context<any> = createContext(null);

export const LinkContextWrapper = ({value, children}: {value: ResponseType, children: ReactNode}) => {
    return (
        <LinkContext.Provider value={value}>
            {children}
        </LinkContext.Provider>
    )
}