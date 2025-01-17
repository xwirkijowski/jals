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
import {ThemeContextWrapper} from "../contexts/theme/theme.context";

// Components
import {Body} from "@comp/Layout/Body";
import {Header} from '@comp/Layout/Header';
import {Footer} from '@comp/Layout/Footer';
import {getCookie} from "../lib/auth/session.cookies";
import {getUser} from "../contexts/auth/auth.utils.server";

const RootLayout = async (
    {children, modal}: { children: React.ReactNode, modal: React.ReactNode }
) => {
    const session = await getCookie();
    const user = await getUser(session);

    return (
        <html lang="en" className="bg-white">
            <AuthContextWrapper session={session} user={user}>
                <ThemeContextWrapper>
                    <Body>
                        <Header/>
                        <main className="w-full flex-1 px-8 flex">
                            {modal}
                            {children}
                        </main>
                        <Footer version={process?.env?.npm_package_version} />
                    </Body>
                </ThemeContextWrapper>
            </AuthContextWrapper>
        </html>
    )
}

export default RootLayout