import cx from 'classnames';
import React, { JSX } from 'react';

// Types

enum ButtonTypeEnum {
    primary = 'primary',
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
    light = 'light',
    dark = 'dark',
    theme = 'theme',
    themeInverse = 'theme',
    darkPrimary = 'darkPrimary',
}

type ButtonType = keyof typeof ButtonTypeEnum;

interface ButtonProps {
    btnType?: ButtonType,
    className?: string,
    effects?: boolean,
    children?: React.ReactNode,
}

// Styles

const typeStyles: Record<ButtonType, Array<string>|string> = {
    primary: [
        'text-white bg-orange-500 shadow-orange-500/20 hover:bg-orange-400',
        'dark:text-white dark:bg-orange-500 dark:shadow-orange-500/20 dark:hover:bg-orange-400',
    ],
    success: 'text-white bg-green-500 shadow-green-500/20 hover:bg-green-400',
    info: 'text-white bg-blue-500 shadow-blue-500/20 hover:bg-blue-400',
    warning: 'text-white bg-orange-500 shadow-orange-500/20 hover:bg-orange-400',
    danger: 'text-white bg-red-500 shadow-red-500/20 hover:bg-red-400',
    light: [
        'text-zinc-900 bg-zinc-100 shadow-zinc-900/20 hover:bg-zinc-200',
        'dark:text-zinc-900 dark:bg-gray-100 dark:shadow-gray-800/20 dark:hover:bg-gray-300',
    ],
    dark: [
        'text-white bg-zinc-900 shadow-zinc-900/20 hover:bg-zinc-700',
        'dark:text-white dark:bg-gray-800 dark:shadow-gray-800/20 dark:hover:bg-gray-700',
    ],
    theme: [],
    themeInverse: [],
    darkPrimary: [],
}

typeStyles.theme = [typeStyles.light[0], typeStyles.dark[1]];
typeStyles.themeInverse = [typeStyles.dark[0], typeStyles.light[1]];
typeStyles.darkPrimary = [typeStyles.dark[0], typeStyles.primary[1]];

export default ({
    btnType = 'primary',
    className,
    effects = false,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps): React.ReactNode => {
    return (
        <button
            className={cx(
                "trans px-5 py-3 text-base text-nowrap rounded-xl font-bold ",
                {"shadow-xl hover:shadow-md hover:scale-[0.975]": effects},
                typeStyles[btnType],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}