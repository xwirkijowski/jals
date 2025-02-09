"use client";

import {ReactNode} from "react";
import {merge} from "@lib/merge";
import {SCompProps} from "@type/common";

export const Spinner = ({className}: SCompProps.TBase): ReactNode => {
    return (
        <span className={merge(
            'spinner animate-spin font-sm',
            'inline-block relative h-[1em] w-[1em] text-[1em] overflow-hidden',
            'after:content-[""] after:top-0 after:right-0 after:bottom-0 after:left-0 after:absolute after:block after:rounded-full after:border-[0.25em] after:border-transparent after:border-r-[currentColor] after:border-t-[currentColor]',
            className
        )}></span>
    )
}
