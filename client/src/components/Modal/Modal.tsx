import React from 'react';
import cx from "classnames";

export const Modal = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={cx(

        )}>
            {children}
        </div>
    )
}