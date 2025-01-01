import cx from 'classnames';
import React, { JSX, ComponentType } from 'react';

// Types

enum ButtonTypeEnum {
    primary = 'primary',
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
    light = 'light',
    dark = 'dark',
}

type ButtonType = keyof typeof ButtonTypeEnum;

interface ButtonProps {
    type?: ButtonType,
    element?: ComponentType | keyof JSX.IntrinsicElements,
    className?: string,
    effects?: boolean,
    buttonType?: "button" | "submit" | "reset" | undefined,
    children?: React.ReactNode,
}

// Styles

const typeStyles: Record<ButtonType, string> = {
    primary: 'text-white bg-orange-500 shadow-orange-500/20 hover:bg-orange-400',
    success: 'text-white bg-green-500 shadow-green-500/20 hover:bg-green-400',
    info: 'text-white bg-blue-500 shadow-blue-500/20 hover:bg-blue-400',
    warning: 'text-white bg-orange-500 shadow-orange-500/20 hover:bg-orange-400',
    danger: 'text-white bg-red-500 shadow-red-500/20 hover:bg-red-400',
    light: 'text-zinc-900 bg-zinc-100 shadow-zinc-900/20 hover:bg-zinc-200',
    dark: 'text-white bg-zinc-900 shadow-zinc-900/20 hover:bg-zinc-700',
}

export default ({
    type = 'primary',
    element: Element = 'button',
    className,
    effects = false,
    buttonType,
    children,
    ...props
}: ButtonProps & React.HTMLAttributes<HTMLButtonElement|HTMLAnchorElement|Element>) => {

    // Attach specific props
    props = {
        ...props,
        ...(buttonType && {type: buttonType}),
    }

    return (
        <Element
            className={cx(
                "duration-150 transition-all px-5 py-3 text-base text-nowrap rounded-xl font-bold ",
                {"shadow-xl hover:shadow-md hover:scale-[0.975]": effects},
                typeStyles[type],
                className
            )}
            {...props}
        >
            {children}
        </Element>
    )
}