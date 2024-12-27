import React from "react";
import type { Metadata } from 'next';

import '../css/globals.css';

import {Footer} from '@/comp/layout/footer';

export const metadata: Metadata = {
    title: {
        template: "%s - jals.wxme.dev",
        default: 'JALS on Next.js - jals.wxme.dev'
    },
}

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
      <html lang="en">
        <body>

            <main>
                {children}
            </main>
            <Footer />
        </body>
      </html>
  )
}

export default RootLayout