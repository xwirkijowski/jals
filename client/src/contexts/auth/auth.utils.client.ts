import {TContextSession, TContextSessionUnion} from "./auth.context";

export const isSessionValid = (session: TContextSessionUnion): session is TContextSession => {
	return !!(session && session !== 'invalid' && session?.id);
}