import {TSessionCookie} from "../../lib/auth/session.types";

export type TAuthContext = {
	session: TAuthContextUnion;
	user: TCurrentUser
}

export type TCurrentUser = {
	id: string
	email: string
	isAdmin: boolean
	version: number
} | null

export type TAuthContextUnion = TSessionCookie | null