"use client";

import React from 'react';
import {motion} from "motion/react";

import {merge} from "@lib/merge";

import {TButtonProps} from "@comp/button/button.types";
import {typeStyles} from "@comp/button/button.styles";

export const Button = ({
    btnType = 'primary',
    effects = false,
    type = 'button',
    size = 'md',
    group = false,
    disabled = false,
    custom = false,
    className,
    children,
    ...props
}: TButtonProps): React.ReactNode => {
    const roundedMap = {
        'sm': 'md',
        'md': 'xl',
        'lg': 'xl',
    }

    return (
        // @ts-ignore: Motion issue with duplicate declaration
        <motion.button
            type={type}
            disabled={disabled}
            onClick={!props?.onClick && disabled
                ? (e)=>e.preventDefault()
                : undefined
            }
            className={merge(
                "trans text-nowrap font-bold",
                {['rounded-'+roundedMap[size]]: (group !== 'middle')},
                {'rounded-e-none': (group === 'start')},
                {'rounded-s-none': (group === 'end')},
                {'px-2 text-sm leading-loose': size === 'sm'},
                {'px-5 py-3 text-base': size === 'md'},
                {'': size === 'lg'},
                {"shadow-xl hover:shadow-md hover:!scale-[0.975]": effects},
                typeStyles[btnType],
                "disabled:cursor-not-allowed",
                {"disabled:opacity-50": !custom},
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    )
}