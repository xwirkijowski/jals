import React from "react";
import type {Metadata} from 'next';

import '../css/globals.css';

import {Footer} from '@/comp/layout/footer';
import {Header} from '@/comp/layout/header';

export const metadata: Metadata = {
    title: {
        template: "%s - jals.wxme.dev",
        default: 'JALS on Next.js - jals.wxme.dev'
    }
}

export const viewport: string = "width=device-width"

const RootLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <html lang="en" className="bg-white">
        <body className="flex items-center justify-center min-h-screen">
        <Header/>
        <main className="w-full flex-1 px-8 flex">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    )
}

export default RootLayout