import React from "react";
import cx from "classnames";

import {Label} from "@comp/Form/Label";
import {inputStyles} from "@comp/Form/common.styles";

type THTMLInput = React.InputHTMLAttributes<HTMLInputElement>;

type TProps = {
    withLabel?: string
    id?: THTMLInput['id']
    placeholder?: THTMLInput['placeholder']
    className?: string
    ref?: React.Ref<HTMLInputElement>
} & THTMLInput;

export const Input = (
    {withLabel = undefined, id, placeholder, className, ...props}: TProps
) => {
    return (
        <>
            {withLabel ? (
                <div className={cx(
                    'flex-col flex w-full group relative'
                )}>
                    <input id={id} placeholder={withLabel ? '' : placeholder} {...props} className={cx(
                        {'peer': withLabel},
                        inputStyles,
                        className,
                    )} />
                    {withLabel &&
                        <Label id={id}>{withLabel}</Label>
                    }
                </div>
            ) : (
                <input id={id} placeholder={withLabel ? '' : placeholder} {...props} className={cx(
                    {'peer': withLabel},
                    inputStyles,
                    className,
                )} />
            )}
        </>
    )
}