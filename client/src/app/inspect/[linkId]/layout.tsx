"use server";

import React from "react";

import {LinkContextWrapper} from "@ctx/link/link.context";
import {fetchLink} from "@ctx/link/link.utils.server";

import {Container} from "@comp/container";
import {LinkNotFound} from "@comp/@organisms/link-not-found";

// Metadata
import {Metadata} from "next";
export const generateMetadata = async (
    { params, modal } // @ts-ignore Fuck next.js
): Promise<Metadata> => {
    const linkId = (await params).linkId;
    return {
        title: `Inspect ${linkId}`,
    }
}

export default async function Layout (
    {modal, children, params}: { modal: React.ReactNode, children: React.ReactNode, params: any }
): Promise<React.ReactNode> {
    const linkId: string = (await params).linkId;

    const {data} = await fetchLink(linkId);
    
    if (!data) return <Container><LinkNotFound linkId={linkId} context={'inspect'} /></Container>
    
    return (
        <LinkContextWrapper data={data.link}>
            {modal}
            {children}
        </LinkContextWrapper>
    )
}