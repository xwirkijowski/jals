"use client";


import {createContext, ReactNode, Suspense} from "react";
import {TAuthContext, TAuthContextUnion, TCurrentUser} from "./auth.types";

export const AuthContext = createContext<TAuthContext>({
    session: null,
    user: null
});

export const AuthContextWrapper = (
    {session, user, children}:
    {session: TAuthContextUnion, user: TCurrentUser, children: ReactNode}) => {
    return (
        <AuthContext.Provider value={{session, user}}>
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </AuthContext.Provider>
    )
}