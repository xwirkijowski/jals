"use server";

import {getClient} from "../../lib/apollo-client";
import {getSessionHeader} from "../../lib/auth/session";
import {CURRENT_USER} from "./user.query";

export const getUser = async (session) => {
	if (session) {
		const context = await getSessionHeader(true);

		const {data} = await getClient().query({query: CURRENT_USER, context});
		if (data && data?.currentUser) {
			return data.currentUser;
		}

		return null;
	} else {
		return null;
	}
}