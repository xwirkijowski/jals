"use client";

export function getHeaders (session) {
	
	const agent = navigator.userAgent;
	
	const userHeaders = {
		"jals-user-agent": agent,
	}
	
	return {
		headers: {
			authorization: session.sessionId,
			...userHeaders
		}
	}
}