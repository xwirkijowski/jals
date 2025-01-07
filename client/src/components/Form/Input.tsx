import cx from "classnames";
import React from "react";

interface InputInterface {
    withLabel?: string
    id?: React.InputHTMLAttributes<HTMLInputElement>['id']
}

export const Input = ({
    withLabel,
    id,
    ...props
}: InputInterface & React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className={cx(
            'flex-col flex w-full group relative'
        )}>
            <input id={id} placeholder={''} {...props} className={cx(
                'flex-1 resize-none peer',
                'bg-white col-span-full',
                'transition-all duration-150',
                'text-zinc-600 text-md caret-orange-500',
                'outline-none',
                'rounded-xl',
                'border border-zinc-900/15 px-4 py-3',
                'placeholder:text-zinc-600/50',
                'group-focus-within:border-orange-500',
                'disabled:border-orange-500',
                '[&:invalid:not(:placeholder-shown)]:!border-red-500 [&:invalid:not(:placeholder-shown)]:caret-red-500',
                'valid:!border-green-500 valid:caret-green-500',
            )}/>
            {withLabel &&
                <label htmlFor={id} className={cx(
                    'absolute bg-white px-0.5 py-0 left-3.5 bottom-3 mb-[1px] rounded-md block text-md text-zinc-400',
                    'transition-all duration-150',
                    'group-focus-within:bottom-[80%] group-focus-within:text-sm group-focus-within:text-orange-500',
                    'peer-valid:bottom-[80%] peer-valid:text-sm',
                    'peer-[:not(:placeholder-shown)]:bottom-[80%] peer-[:not(:placeholder-shown)]:text-sm',
                    'peer-[:invalid:not(:placeholder-shown)]:text-red-500',
                    'peer-valid:text-green-500',
                )}>{withLabel}</label>
            }
        </div>
    )
}