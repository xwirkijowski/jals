"use client";

import React, {createContext, useEffect, useState} from "react";

import {SCompProps} from "@type/common";
import {TLink} from "@type/data/link";

interface ILinkContext {
    link: TLink | null | undefined
    setLink: (link: TLink) => void
}

export const LinkContext = createContext<ILinkContext>({
    link: undefined,
    setLink: () => {},
});

type TProps = {
    data?: TLink
} & SCompProps.TBase<true>

export const LinkContextWrapper = ({data, children}: TProps): React.ReactNode => {
    const [link, setLink] = useState<ILinkContext['link']>(data);
    
    const providerValue = {
        link,
        setLink
    }
    
    return (
        <LinkContext.Provider value={providerValue}>
            {children}
        </LinkContext.Provider>
    )
}