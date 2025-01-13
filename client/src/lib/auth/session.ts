import 'server-only';
import { cookies } from 'next/headers';

const cookieName = 'jals-session';
const cookieExpire = 60 * 60 * 1000;

type TSessionCookie = {
	userId: string;
	sessionId: string;
} | 'invalid' | undefined

export const createSession = async (data: any) => {
	const content: TSessionCookie = {
		sessionId: data.sessionId,
		userId: data.user.id,
	};
	const cookieStore = await cookies();

	cookieStore.set(cookieName, JSON.stringify(content), {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + cookieExpire),
		sameSite: 'strict',
		path: '/',
	})
}

export const refreshSession = async () => {
	const cookieStore = await cookies();
	const session: string | undefined = cookieStore.get(cookieName)?.value
	if (!session) return null;

	let payload: TSessionCookie;
	try {
		payload = JSON.parse(session) }
	catch (err) { return null; } // @todo Error handling

	if (!payload) return null;

	cookieStore.set(cookieName, session, {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + cookieExpire),
		sameSite: 'strict',
		path: '/',
	})
}

export const invalidateSession = async () => {
	const cookieStore = await cookies();
	cookieStore.set(cookieName, 'invalid', {
		httpOnly: true,
		secure: true,
		expires: new Date(Date.now() + cookieExpire),
		sameSite: 'strict',
		path: '/',
	})
}

export const deleteSession = async () => {
	const cookieStore = await cookies();
	cookieStore.delete(cookieName);
}

export const getSession = async () => {
	const cookieStore = await cookies();
	const session: string | undefined = cookieStore.get(cookieName)?.value || undefined;

	if (!session) return null;
	else if (session === 'invalid') return 'invalid';
	else {
		let payload: TSessionCookie;

		try {
			payload = JSON.parse(session) }
		catch (err) { return null; } // @todo Error handling

		return payload;
	}
}

export const getSessionHeader = async () => {
	const session = await getSession();
	if (!session || session === 'invalid' || !session?.sessionId) return undefined;
	else return 'Bearer ' + session.sessionId;
}

export const getSessionContext = async () => {
	const authorization = await getSessionHeader();

	return (authorization) ? {
		headers: {
			authorization: await getSessionHeader()
		}
	} : {}
}