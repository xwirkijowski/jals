"use server";

import {LOG_OUT} from "./LogOut.query";
import {getClient} from "../../lib/apollo-client";
import {ResponseType} from "@type/data/Response";
import {getSessionHeader} from "../../lib/auth/session";
import {deleteCookie} from "../../lib/auth/session.cookies";
import {revalidatePath} from "next/cache";

export const LogOutAction = async (
	state: ResponseType
) => {

	const {data: {logOut: data}} = await getClient().mutate({
		mutation: LOG_OUT,
		context: await getSessionHeader(true),
	})

	await deleteCookie()
	revalidatePath('/', 'layout')

	return data;
}