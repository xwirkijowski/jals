import {NextRequest, NextResponse} from "next/server";
import {DocumentNode} from "graphql";

import {getClient} from "@lib/apollo-client";
import {getHeaders} from "@lib/auth/session-server";
import {createCookie} from "@lib/auth/session.cookies";

import {LOG_IN} from "@act/@auth/login/stage2/LogIn.query";
import {REGISTER} from "@act/@auth/register/stage2/Register.query";

export async function GET(req: NextRequest) {
	const searchParams: URLSearchParams = req.nextUrl.searchParams,
		magicString: unknown = searchParams.get("v");
	let action: unknown = searchParams.get("a");
	
	if (!magicString || !action) {
		return NextResponse.redirect(new URL('/login', req.url));
	} else if (typeof magicString !== "string" || typeof action !== "string") {
		const url = new URL('/login', req.url);
		url.searchParams.set('magic', 'malformed');
		return NextResponse.redirect(url);
	}
	
	if (!['login', 'register'].includes(action)) {
		action = 'login';
	}
	
	let query: DocumentNode;
	if (action === 'register') {
		query = REGISTER;
	} else {
		query = LOG_IN;
	}
	
	const authRequest = await getClient().mutate({
		mutation: query,
		variables: {
			input: {
				magic: magicString,
			}
		},
		context: await getHeaders(),
		errorPolicy: 'all',
	})
	
	const authData = (action === 'register')
		? authRequest?.data?.register
		: authRequest?.data?.logIn;
	
	if (authData && authData?.result?.success === true && authData?.sessionId) {
		await createCookie(authData);
		return NextResponse.redirect(new URL('/', req.url));
	} else {
		// @todo: Handle errors
		const url = new URL(`/${action}`, req.url);
		url.searchParams.set('magic', 'failed');
		return NextResponse.redirect(url);
	}
}