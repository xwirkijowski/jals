"use server";

import React from "react";

import {getClient} from '@lib/apollo-client';
import {LinkContextWrapper} from "@ctx/link/link.context";
import {getHeaders} from "@lib/auth/session-server";

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
            updatedAt
            version
        }
    }
`;


export default async function Layout (
    {modal, children, params}: { modal: React.ReactNode, children: React.ReactNode, params: any }
): Promise<React.ReactNode> {
    const linkId: string = (await params).linkId;

    // @todo Add types for this query
    const {data} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: await getHeaders()});
    
    if (!data) return <Container><LinkNotFound linkId={linkId} context={'inspect'} /></Container>
    
    return (
        <LinkContextWrapper data={data.link}>
            {modal}
            {children}
        </LinkContextWrapper>
    )
}