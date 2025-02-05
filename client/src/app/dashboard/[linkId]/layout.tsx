"use server";

import React from "react";
import {ReactNode} from "react";

import {fetchLink} from "@ctx/link/link.utils.server";
import {LinkContextWrapper} from "@ctx/link/link.context";

import {ServersideNofify} from "@comp/@dashboard/serverside-nofify";

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
    {modal, children, params}: { modal: ReactNode, children: ReactNode, params: any }
): Promise<ReactNode> {
    const linkId: string = (await params).linkId;
    
    const {data, loading} = await fetchLink(linkId, 'owner');
    
    if (loading) return ('loading') // @todo: Skeleton (?)
    
    if (!loading && !data) return <ServersideNofify action={'no-link'} route={'/dashboard'} />
    
    return (
        <LinkContextWrapper data={data.link}>
            {children}
        </LinkContextWrapper>
    )
}