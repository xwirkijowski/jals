"use client";

import React from 'react';
import {useRouter} from 'next/navigation';

import {merge} from "@lib/merge";

export const ModalWrapper = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();

    return (
        <div className={merge(
            'absolute top-0 right-0 bottom-0 left-0 z-[200]',
            'flex flex-col justify-center items-center',
            'bg-zinc-900/25 backdrop-blur-md',
            'dark:bg-gray-900/25'
        )} onClick={(e)=> e.target === e.currentTarget && router.back()}>
            {children}
        </div>
    )
}