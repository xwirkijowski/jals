'use server';
import { cookies } from 'next/headers';

// Types
import {TSessionCookie} from "./session.types";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

const cookieName = 'jals-session',
	  cookieExpire = 60 * 60;

/**
 * Returns a cookie settings object
 */
const cookieSettings = (): ResponseCookie => {
	return {
		httpOnly: true,
		secure: false, // @todo change to true on prod
		maxAge: cookieExpire,
		sameSite: 'lax', // @todo change to strict on prod
		path: '/',
	} as ResponseCookie;
}

/**
 * Construct a cookie and write it with outgoing HTTP request
 *
 * @async
 *
 * @param   data    Session data
 * @return  Promise<boolean>    Was the cookie created?
 */
export const createCookie = async (data: {sessionId: string, user: {id: string}}): Promise<boolean> => {
	if (!data?.sessionId || !data?.user?.id) return false;

	const payload: TSessionCookie = {
		sessionId: data.sessionId,
		userId: data.user.id,
	};
	
	(await cookies()).set(cookieName, JSON.stringify(payload), cookieSettings())
	return true;
};

/**
 * Refreshes existing cookie by overwriting it outgoing HTTP request.
 * If no cookie found, does nothing, returns `false`.
 *
 * @async
 *
 * @return  Promise<boolean>    Was the cookie refreshed?
 */
export const refreshCookie = async (): Promise<boolean> => {
	const cookieStore = await cookies();
	const session: string | undefined = cookieStore.get(cookieName)?.value;
	if (!session) { return false }

	let payload: TSessionCookie;
	try {
		payload = JSON.parse(session) }
	catch (err) { return false; } // Payload must be malformed, invalid @ts-ignore

	cookieStore.set(cookieName, JSON.stringify(payload), cookieSettings());
	return true;
};

/**
 * Deletes a cookie with an outgoing HTTP request
 *
 * @todo Add check if cookie was removed.
 *
 * @async
 *
 * @return  Promise<boolean>    Was the cookie removed?
 */
export const deleteCookie = async (): Promise<boolean> => {
	(await cookies()).delete(cookieName);
	return true;
};


/**
 * Gets the session cookie from incoming HTTP request
 *
 * @async
 *
 * @return  Promise<TSessionCookie|null>    If found, returns payload, otherwise `null`.
 */
export const getCookie = async (): Promise<TSessionCookie|null> => {
	const session: string | undefined = (await cookies()).get(cookieName)?.value;
	if (!session) { return null; }

	let payload: TSessionCookie;

	try {
		payload = JSON.parse(session) }
	catch (err) { return null; } // Payload must be malformed, invalid

	return payload;
};