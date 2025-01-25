"use client";


import {createContext, ReactNode} from "react";
import {TAuthContext, TAuthContextUnion, TCurrentUser} from "./auth.types";

export const AuthContext = createContext<TAuthContext>({
    session: null,
    user: null
});

export const AuthProvider = (
    {session, user, children}:
    {session: TAuthContextUnion, user: TCurrentUser, children: ReactNode}) => {
    return (
        <AuthContext.Provider value={{session, user}}>
            {children}
        </AuthContext.Provider>
    )
}