"use server";

import React from "react";

// Fonts
import {Montserrat} from "next/font/google";
const montserrat = Montserrat({subsets: ['latin-ext']});

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
import 'style/globals.css';

import {getCookie} from "@lib/auth/session.cookies";

// Contexts
import {getUser} from "@ctx/auth/auth.utils.server";
import {AuthProvider} from "@ctx/auth/auth.context";
import {ThemeProvider} from "@ctx/theme/theme.context";
import {NotificationProvider} from "@ctx/notification/notification.context";

// Components
import {Header, Body, Footer} from '@comp/Layout';
import {Notifications} from "@comp/notifications";

const RootLayout = async (
    {children, modal}: { children: React.ReactNode, modal: React.ReactNode }
):Promise<React.ReactNode> => {
    const session = await getCookie();
    const user = await getUser(session);
    
    return (
        <AuthProvider session={session} user={user}>
            <NotificationProvider>
                <ThemeProvider>
                    <html lang="en">
                        <Body className={`${montserrat.className} antialiased`}>
                            <Header/>
                            <main className="w-full flex-1 px-8 flex">
                                {modal}
                                {children}
                            </main>
                            <Notifications />
                            <Footer version={process?.env?.npm_package_version} />
                        </Body>
                    </html>
                </ThemeProvider>
            </NotificationProvider>
        </AuthProvider>
    )
}

export default RootLayout