// Imports
import {getClient} from '../../../apollo-client';
import {LinkContextWrapper} from "./context";
import React from "react";

// Metadata
import {Metadata, ResolvingMetadata} from "next";
export const generateMetadata = async (
    { params, searchParams }: Props,
    parent: ResolvingMetadata
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


export default async ({children, params}: { children: React.ReactNode, params: any }) => {
    const linkId = (await params).linkId;
    const {data} = await getClient().query({query: LINK, variables: {linkId: linkId}});

    console.log(data)

    return (
        <LinkContextWrapper value={{data}}>
            {children}
        </LinkContextWrapper>
    )
}