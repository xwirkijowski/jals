"use server";

import React, {Suspense} from "react";

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
import {getUser} from "@ctx/auth/auth.utils.server";
import {AuthProvider} from "@ctx/auth/auth.context";
import {ThemeProvider} from "@ctx/theme/theme.context";

// Components
import {Body} from "@comp/Layout/Body";
import {Header} from '@comp/Layout/Header/Header';
import {Footer} from '@comp/Layout/Footer';
import {getCookie} from "@lib/auth/session.cookies";
import {Spinner} from "@comp/Spinner/Spinner";

const RootLayout = async (
    {children, modal}: { children: React.ReactNode, modal: React.ReactNode }
) => {
    const session = await getCookie();
    const user = await getUser(session);

    return (
        <html lang="en" className="bg-white">
                <AuthProvider session={session} user={user}>
                    <ThemeProvider>
                        <Body>
                            <Header/>
                            <main className="w-full flex-1 px-8 flex">
                                {modal}
                                {children}
                            </main>
                            <Footer version={process?.env?.npm_package_version} />
                        </Body>
                    </ThemeProvider>
                </AuthProvider>
        </html>
    )
}

export default RootLayout