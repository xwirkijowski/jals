"use client";


import {createContext, ReactNode} from "react";
import {TAuthContext, TAuthContextUnion, TUser} from "./auth.types";

export const AuthContext = createContext<TAuthContext>({
    session: null,
    user: null
});

export const AuthProvider = (
    {session, user, children}:
    {session: TAuthContextUnion, user: TUser, children: ReactNode}) => {
    return (
        <AuthContext.Provider value={{session, user}}>
            {children}
        </AuthContext.Provider>
    )
}