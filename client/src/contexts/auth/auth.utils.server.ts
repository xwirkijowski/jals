import 'server-only';

import {getSession, getSessionContext} from "../../lib/auth/session";
import {getClient} from "../../lib/apollo-client";
import {CURRENT_SESSION} from "./auth.query";

export const resolveSession = async () => {
	const session = await getSession();

	if (session !== undefined) {
		if (session === 'invalid') {
			return 'invalid';
		} else {
			const query = await getClient().query({query: CURRENT_SESSION, context: await getSessionContext()});

			const data = {
				id: query.data?.currentSession?.id,
				user: {
					id: query.data?.currentSession?.user?.id,
					email: query.data?.currentSession?.user?.email,
					isAdmin: query.data?.currentSession?.user?.isAdmin,
					version: query.data?.currentSession?.user?.version,
				},
				version: query.data?.currentSession?.version,
			}

			return data;
		}
	} else return undefined;
}