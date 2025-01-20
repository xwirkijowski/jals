"use client";

import {createContext, ReactNode} from "react";

import {TResponse} from '@type/data/response';

export const LinkContext = createContext<TResponse>({});

export const LinkContextWrapper = ({value, children}: {value: TResponse, children: ReactNode}) => {
    return (
        <LinkContext.Provider value={value}>
            {children}
        </LinkContext.Provider>
    )
}