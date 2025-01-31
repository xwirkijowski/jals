import cx from 'classnames';
import React from 'react';

import {styles} from "@comp/callout/callout.styles";
import {TCalloutProps} from "@comp/callout/callout.types";

export const Callout = (
    {title, type = 'light', className, children, ...props}: TCalloutProps
): React.ReactNode => {
    return (
        <div className={cx(
            "max-w-xl p-4 items-center shadow-xl rounded-xl w-full flex gap-4",
            styles[type],
            className,
        )} role="alert" {...props}>
            {title && <p className={"font-bold uppercase text-sm"}>{title}</p>}
            {children}
        </div>
    )
}