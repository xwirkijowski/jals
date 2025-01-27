"use server";

import React from "react";

import {getClient} from '@lib/apolloClient';
import {LinkContextWrapper} from "@ctx/link/link.context";
import {getHeaders} from "@lib/auth/session";

import {Container} from "@comp/Container/Container";
import {LinkNotFound} from "@comp/organisms/NotFound";

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
                <Container>
                    <LinkNotFound linkId={linkId} context={'inspect'} />
                </Container>
            )}
        </>
    )
}

export default Layout;