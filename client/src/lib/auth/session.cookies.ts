'use server';
import { cookies } from 'next/headers';

// Types
import {TSessionCookie} from "./session.types";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

const cookieName = 'jals-session';
const cookieExpire = 60 * 60;
const cookieSettings = (): ResponseCookie => {
	return {
		httpOnly: true,
		secure: false, // @todo change to true on prod
		maxAge: cookieExpire,
		sameSite: 'lax', // @todo change to strict on prod
		path: '/',
	} as ResponseCookie;
}

export const createCookie = async (data: {sessionId: string, user: {id: string}}): Promise<boolean> => {
	if (!data?.sessionId || !data?.user?.id) return false;

	const payload: TSessionCookie = {
		sessionId: data.sessionId,
		userId: data.user.id,
	}

	const cookieStore = await cookies();

	cookieStore.set(cookieName, JSON.stringify(payload), cookieSettings())
	return true;
};

export const refreshCookie = async (): Promise<boolean> => {
	const cookieStore = await cookies();
	const session: string | undefined = cookieStore.get(cookieName)?.value;
	if (!session) { return false }

	let payload: TSessionCookie;
	try {
		payload = JSON.parse(session) }
	catch (err) { return false; } // Payload must be malformed, invalid

	cookieStore.set(cookieName, JSON.stringify(payload), cookieSettings());
	return true;
};

export const deleteCookie = async (): Promise<boolean> => {
	const cookieStore = await cookies();
	cookieStore.delete(cookieName);
	return true;
};

export const getCookie = async (): Promise<TSessionCookie|null> => {
	const cookieStore = await cookies();
	const session: string | undefined = cookieStore.get(cookieName)?.value;
	if (!session) { return null }

	let payload: TSessionCookie;

	try {
		payload = JSON.parse(session) }
	catch (err) { return null; } // Payload must be malformed, invalid

	return payload;
};