import 'server-only';
import {getCookie} from "./session.cookies";
import {headers} from "next/headers";

export const getSessionHeader = async () => {
	const session = await getCookie();
	if (!session || !session?.sessionId) return undefined;
	else {
		const auth = 'Bearer ' + session.sessionId;
		const agent = (await headers()).get('user-agent');
		const addr = (await headers()).get('x-forwarded-for');

		return {
			headers: {
				authorization: auth,
				"jals-user-agent": agent,
				"jals-user-addr": addr,
			}
		}
	}
}