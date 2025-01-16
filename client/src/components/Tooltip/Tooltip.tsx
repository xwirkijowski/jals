import React, {CSSProperties} from "react";
import cx from "classnames";

export const Tooltip = ({children, id, style}: { children: React.ReactNode, id: string, style: CSSProperties }) => {
    return (
        <div
            id={id}
            popover={"auto"}
            // @ts-ignore
            style={style}
            className={cx(
                'text-left',
                'bottom-[anchor(top)] right-[calc(anchor(right)_-_0.5rem)] [position-area:top_span-left]',
                'gap-4 flex-col [&:popover-open]:flex max-w-sm overflow-visible rounded-xl bg-white border border-zinc-900/15 text-zinc-900 py-4 px-5 absolute mx-2 my-4 text-sm shadow-xl shadow-zinc-900/10',
                'before:content-[""] before:block before:absolute before:border-t-8 before:border-t-white before:border-8 before:border-transparent',
                'before:right-8 before:top-full'
            )}
        >
            {children}
        </div>
    )
}