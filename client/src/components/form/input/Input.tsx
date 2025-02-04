import React, {Ref} from "react";

import {merge, cx} from "@lib/merge";

import {Label} from "@comp/form/label/Label";
import {inputStyles} from "@comp/form/common.styles";

import {SCompProps} from "@type/common";

type THTMLInput = SCompProps.THTMLInput<['className']>;

type TProps = {
    withLabel?: string
    id?: THTMLInput['id']
    placeholder?: THTMLInput['placeholder']
    ref?: Ref<HTMLInputElement>
} & THTMLInput & SCompProps.TBase;

export const Input = (
    {withLabel = undefined, id, placeholder, className, ...props}: TProps
) => {
    return (
        <>
            {withLabel ? (
                <div className={cx(
                    'flex-col flex w-full group relative'
                )}>
                    <input id={id} placeholder={withLabel ? '' : placeholder} {...props} className={merge(
                        {'peer': withLabel},
                        inputStyles,
                        className,
                    )} />
                    {withLabel &&
                        <Label id={id}>{withLabel}</Label>
                    }
                </div>
            ) : (
                <input id={id} placeholder={withLabel ? '' : placeholder} {...props} className={merge(
                    {'peer': withLabel},
                    inputStyles,
                    className,
                )} />
            )}
        </>
    )
}