import 'server-only';
import {getCookie} from "./session.cookies";
import {headers as Headers} from "next/headers";

export const getHeaders = async () => {
	const agent = (await Headers()).get('user-agent');
	const addr = (await Headers()).get('x-forwarded-for');

	const userHeaders = {
		"jals-user-agent": agent,
		"jals-user-addr": addr,
	}

	const session = await getCookie();

	if (!session || !session?.sessionId) return {headers: userHeaders};
	else {
		const auth = 'Bearer ' + session.sessionId;

		return {
			headers: {
				authorization: auth,
				...userHeaders
			}
		}
	}
}