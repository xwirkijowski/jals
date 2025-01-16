"use client";

import Cookies from "js-cookie";

import {createContext, ReactNode, useCallback, useState} from "react";
import {TSessionCookie} from "../../lib/auth/session.types";

export type TAuthContext = {
    session: TAuthContextUnion;
    refreshSession: Function
}

export const AuthContext = createContext<TAuthContext>({session: null, refreshSession: () => {}});

export type TAuthContextUnion = TSessionCookie | null

export const AuthContextWrapper = ({initialSession, children}: {initialSession: TAuthContextUnion, children: ReactNode}) => {
    const [session, setSession] = useState(initialSession);

    const refreshSession = useCallback(() => {
        const cookie = Cookies.get('jals-session');

        console.log('refresh')

        if (cookie) {
            try {
                const payload = JSON.parse(cookie);
                setSession(payload);
            } catch {
                setSession(null)
            }
        } else setSession(null);
    }, [])

    return (
        <AuthContext.Provider value={{session, refreshSession}}>
            {children}
        </AuthContext.Provider>
    )
}