"use server";

// Imports
import {getClient} from '@lib/apollo-client';
import {LinkContextWrapper} from "@ctx/link/link.context";
import {getHeaders} from "@lib/auth/session";
import {LinkNotFound} from "@comp/Logic/NotFound";
import React from "react";

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

const Layout = async ({
    modal,
    children,
    params,
}: {
    modal: React.ReactNode,
    children: React.ReactNode,
    params: any
}) => {
    const linkId: string = (await params).linkId;

    // @todo Add types for this query
    const {data} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: await getHeaders()});

    return (
        <>
            {data?.link ? (
                <LinkContextWrapper value={{data}}>
                    {modal}
                    {children}
                </LinkContextWrapper>
            ) : (
                <LinkNotFound linkId={linkId} context={'inspect'} />
            )}
        </>
    )
}

export default Layout;