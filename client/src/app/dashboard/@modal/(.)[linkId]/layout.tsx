"use server";

import React from "react";

import {getClient} from '@lib/apollo-client';
import {LinkContextWrapper} from "@ctx/link/link.context";
import {getHeaders} from "@lib/auth/session-server";

// Metadata
import {Metadata} from "next";
export const generateMetadata = async (
    { params } // @ts-ignore Fuck next.js
): Promise<Metadata> => {
    const linkId = (await params).linkId;
    return {
        title: `Inspect ${linkId}`,
    }
}

// Query
import { gql } from "@apollo/client";
const LINK = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            clickCount
            flagCount
            flags {
                note
                createdAt
            }
            createdAt
            createdBy {
                email
            }
            updatedAt
            version
        }
    }
`;

import {ServersideNofify} from "@comp/@dashboard/serverside-nofify";

export default async function Layout (
    {children, params}: { children: React.ReactNode, params: any }
): Promise<React.ReactNode> {
    const linkId: string = (await params).linkId;

    // @todo Add types for this query
    const {data} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: await getHeaders()});
    
    if (!data) return <ServersideNofify action={'no-link'} route={'/dashboard'} />
    
    return (
        <LinkContextWrapper data={data.link}>
            {children}
        </LinkContextWrapper>
    )
}