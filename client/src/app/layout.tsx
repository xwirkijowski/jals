"use server";

import React from "react";

// Metadata
import type {Metadata, Viewport} from 'next';
export const generateMetadata = async (): Promise<Metadata> => ({
    title: {
        template: "%s - jals.wxme.dev",
        default: 'JALS on Next.js - jals.wxme.dev',
    }
})
export const generateViewport = async (): Promise<Viewport> => ({
    width: 'device-width',
});

// Import global styles
import '../css/globals.css';

// Contexts
import {AuthContextWrapper} from "../contexts/auth/auth.context";

// Components
import {Footer} from '@comp/layout/Footer';
import {Header} from '@comp/layout/Header';
import {getCookie} from "../lib/auth/session.cookies";
import {getUser} from "../contexts/auth/auth.utils.server";

const RootLayout = async (
    {children, modal}: { children: React.ReactNode, modal: React.ReactNode }
) => {
    const session = await getCookie();
    const user = await getUser(session);

    return (
        <html lang="en" className="bg-white">
            <AuthContextWrapper initialSession={session}>
                <UserContextWrapper user={user}>
                    <body className="flex items-center justify-center min-h-screen">
                        <Header/>
                        <main className="w-full flex-1 px-8 flex">
                            {modal}
                            {children}
                        </main>
                        <Footer/>
                    </body>
                </UserContextWrapper>
            </AuthContextWrapper>
        </html>
    )
}

export default RootLayout