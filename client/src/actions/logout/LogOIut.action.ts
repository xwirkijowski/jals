"use server";

import {LOG_OUT} from "./LogOut.query";
import {getClient} from "../../lib/apollo-client";
import {ResponseType} from "@type/data/Response";
import {deleteSession, getSessionContext} from "../../lib/auth/session";

export const LogOutAction = async (
	state: ResponseType
) => {

	const {data: {logOut: data}} = await getClient().mutate({
		mutation: LOG_OUT,
		context: await getSessionContext(),
	})

	await deleteSession()
	return data;
}