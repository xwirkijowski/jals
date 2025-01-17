"use server";

// Imports
import {getClient} from '../../../lib/apollo-client';
import {LinkContextWrapper} from "../../../contexts/link/link.context";
import {getSessionHeader} from "../../../lib/auth/session";
import {LinkNotFound} from "@comp/Logic/NotFound";
import React from "react";

// Metadata
import {Metadata} from "next";
export const generateMetadata = async (
    { params }
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

export default async ({
    modal,
    children,
    params,
}: {
    modal: React.ReactNode,
    children: React.ReactNode,
    params: any
}) => {
    const linkId: string = (await params).linkId;
    const {data} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: await getSessionHeader(true)});

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