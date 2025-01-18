import cx from 'classnames';
import React from 'react';
import {SCompProps} from "@type/common";

// Types

enum CalloutTypeEnum {
    primary = 'primary',
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
    light = 'light',
    dark = 'dark',
}

type CalloutType = keyof typeof CalloutTypeEnum;

// Styles @todo Support dark mode
const typeStyles: Record<CalloutType, string> = {
    primary: 'text-white bg-orange-500  shadow-orange-500/20',
    success: 'text-white bg-green-500  shadow-green-500/20',
    info: 'text-white bg-blue-500  shadow-blue-500/20',
    warning: 'text-white bg-orange-500  shadow-orange-500/20',
    danger: 'text-white bg-red-500  shadow-red-500/20',
    light: 'text-zinc-600 bg-zinc-300  shadow-zinc-900/20',
    dark: 'text-white bg-zinc-900  shadow-zinc-900/20',
}

type TProps = {
    title?: string,
    type?: CalloutType,
} & React.HTMLAttributes<HTMLDivElement> & SCompProps.TBase<true>

export default (
    {title, type = 'light', className, children, ...props}: TProps
) => {
    return (
        <div className={cx(
            "max-w-xl p-4 items-center shadow-xl rounded-xl w-full flex gap-4",
            typeStyles[type],
            className,
        )} role="alert" {...props}>
            {title && <p className={"font-bold uppercase text-sm"}>{title}</p>}
            {children}
        </div>
    )
}