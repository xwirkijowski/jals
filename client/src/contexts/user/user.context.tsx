"use client";

import {createContext, useContext} from "react";
import {AuthContext} from "../auth/auth.context";

export type TCurrentUser = {
	user: {
		id: string
		email: string
		isAdmin: boolean
		version: number
	}
} | null

export const UserContext = createContext<TCurrentUser>(null);

export const UserContextWrapper = ({user, children}) => {
	const {session} = useContext(AuthContext);

	return (
		<UserContext.Provider value={user}>
			{children}
		</UserContext.Provider>
	)
}