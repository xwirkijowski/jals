import {TSessionCookie} from "@lib/auth/session.types";

export type TAuthContext = {
	session: TAuthContextUnion;
	user: TUser
}

export type TUser = {
	id: string
	email: string
	isAdmin: boolean
	version: number
} | null

export type TAuthContextUnion = TSessionCookie | null