"use client";

import React, {CSSProperties} from "react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

type TProps = {
    id: string,
    style: CSSProperties
} & SCompProps.TBase<true>

export const Tooltip = ({children, id, style}: TProps): React.ReactNode => {
    return (
        <div
            id={id}
            popover={"auto"}
            style={style}
            className={merge(
                'text-left',
                'bottom-[anchor(top)] right-[calc(anchor(right)_-_0.5rem)] [position-area:top_span-left]',
                'gap-4 flex-col [&:popover-open]:flex max-w-sm overflow-visible rounded-xl bg-white border border-zinc-200 text-zinc-900 py-4 px-5 absolute mx-2 my-4 text-sm shadow-xl shadow-zinc-900/10',
                'dark:shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-800 dark:text-zinc-100',
                'before:content-[""] before:block before:absolute before:border-t-8 before:border-t-white before:border-8 before:border-transparent',
                'before:right-8 before:top-full',
                'dark:before:border-t-gray-700',
            )}
        >
            {children}
        </div>
    )
}