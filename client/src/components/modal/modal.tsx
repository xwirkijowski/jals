import React from 'react';
import {merge} from "@lib/merge";

export const Modal = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={merge(

        )}>
            {children}
        </div>
    )
}