import React from "react";

// Metadata
import type {Metadata} from 'next';
export const metadata: Metadata = {
    title: {
        template: "%s - jals.wxme.dev",
        default: 'JALS on Next.js - jals.wxme.dev'
    }
}
export const viewport: string = "width=device-width"

// Import global styles
import '../css/globals.css';

// Components
import {ApolloWrapper} from './ApolloWrapper';
import {Footer} from '@comp/layout/Footer';
import {Header} from '@comp/layout/Header';

const RootLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <html lang="en" className="bg-white">
            <ApolloWrapper>
                <body className="flex items-center justify-center min-h-screen">
                    <Header/>
                    <main className="w-full flex-1 px-8 flex">
                        {children}
                    </main>
                    <Footer/>
                </body>
            </ApolloWrapper>
        </html>
    )
}

export default RootLayout