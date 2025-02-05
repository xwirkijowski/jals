"use server";

import {LOG_OUT} from "./LogOut.query";
import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session-server";
import {deleteCookie} from "@lib/auth/session.cookies";
import {revalidatePath} from "next/cache";

export const LogOutAction = async () => {

	const {data: {logOut: data}} = await getClient().mutate({
		mutation: LOG_OUT,
		context: await getHeaders(),
		errorPolicy: 'all',
	})

	await deleteCookie()
	
	revalidatePath('/');

	return data;
}