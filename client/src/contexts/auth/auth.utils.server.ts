"use server";

import {getClient} from "@lib/apolloClient";
import {getHeaders} from "@lib/auth/session";
import {CURRENT_SESSION, CURRENT_USER} from "./auth.queries";
import {getCookie} from "@lib/auth/session.cookies";
import {TSessionCookie} from "@lib/auth/session.types";

export const getUser = async (cookie?: TSessionCookie) => {
	if (!cookie) { cookie = await getCookie(); }

	if (cookie) {
		const context = await getHeaders();

		const {data} = await getClient().query({query: CURRENT_USER, context})
		if (data && data?.currentUser) {
			return data.currentUser;
		}

		return null;
	}
	
	return null;
}

export const getSession = async (cookie?: TSessionCookie) => {
	if (!cookie) { cookie = await getCookie(); }

	if (cookie) {
		const context = await getHeaders();

		const {data} = await getClient().query({query: CURRENT_SESSION, context, fetchPolicy: "no-cache"});

		if (data && data?.currentSession) {
			return data.currentSession;
		}

		return null;
	}
	
	return null;
}