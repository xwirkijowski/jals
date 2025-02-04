"use server";

import {TResult} from "@type/data/response";
import {TLink} from "@type/data/link";

import {UPDATE_LINK} from "./modify.queries";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session-server";
import {revalidatePath} from "next/cache";

export const DeleteLinkAction = async (
	{link}: {link: TLink},
	state,
	formData: FormData
) => {
	// @todo Validate data
	
	const target = formData.get('target');
	
	// Set up mutation
	const res = await getClient().mutate({
		mutation: UPDATE_LINK,
		variables: {
			input: {
				linkId: link.id,
				target,
			}
		},
		context: await getHeaders(),
		errorPolicy: 'all',
	});
	
	const data: TResult = res.data.updateLink.result;
	
	// Revalidate data
	revalidatePath('/dashboard/(home)')
	revalidatePath('/dashboard/[linkId]', 'layout')
	
	return data;
}