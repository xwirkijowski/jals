import 'server-only';
import {getCookie} from "./session.cookies";

export const getSessionHeader = async (withContext: boolean = false) => {
	const session = await getCookie();
	if (!session || !session?.sessionId) return undefined;
	else {
		const header = 'Bearer ' + session.sessionId

		if (withContext) return { headers: { authorization: header } };
		else return { authorization: header }
	}
}