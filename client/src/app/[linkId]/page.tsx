"use server";

// Metadata
import {Metadata} from "next";
export const generateMetadata = async (
	{ params }
): Promise<Metadata> => {
	const linkId = (await params).linkId;
	return {
		title: `Redirecting ${linkId}...`,
	}
}

import { redirect } from "next/navigation";
import { getClient } from "../../lib/apollo-client";
import { getSessionContext } from "../../lib/auth/session";

import { gql } from "@apollo/client";
const LINK = gql`
    query Link($linkId: ID!) {
        link(linkId: $linkId) {
            id
            target
            active
            flagCount
        }
    }
`;
const CLICK_ADD = gql`
    mutation ($input: CreateClickInput) {
        createClick(input: $input) {
            result {
                success
                errors {
                    path
                    msg
                    code
                }
            }
        }
    }
`;

export default async function (
	{params}
)  {
	const linkId: string = (await params).linkId;

	const {data: {link}} = await getClient().query({query: LINK, variables: {linkId: linkId}, context: await getSessionContext()});
	const {data: {createClick: {click}}} = await getClient().mutate({mutation: CLICK_ADD, variables: {input: {linkId: linkId}}, context: await getSessionContext()});

	if (link && link?.active === true && link?.flagCount < 5 && link?.target) {
		await click;
		redirect(link.target)
	}

	return (
		<h1>Redirecting to {link?.target||linkId}</h1>
	)
}