"use server";

import {TResult} from "@type/data/response";
import {TLink} from "@type/data/link";

import {DELETE_LINK} from "./delete.queries";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session-server";
import {revalidatePath} from "next/cache";

export const DeleteLinkAction = async (
	{link}: {link: TLink},
	state,
	formData: FormData
) => {
	// @todo Validate data
	
	// Set up mutation
	const res = await getClient().mutate({
		mutation: DELETE_LINK,
		variables: {
			input: {
				linkId: link.id,
			}
		},
		context: await getHeaders(),
		errorPolicy: 'all',
	});
	
	const data: TResult = res.data.deleteLink.result;
	
	// Revalidate data
	revalidatePath('/dashboard/(home)')
	revalidatePath('/dashboard/[linkId]', 'layout')
	
	return data;
}