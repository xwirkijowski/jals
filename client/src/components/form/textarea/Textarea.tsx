"use client";

import React from "react";

import {merge, cx} from "@lib/merge";

import {Label} from "@comp/form/label/Label";
import {inputStyles} from "@comp/form/common.styles";

import {SCompProps} from "@type/common";

type THTMLTextarea = SCompProps.THTMLTextarea<['className']>;

type TProps = {
	withLabel?: string
	id?: THTMLTextarea['id']
	placeholder?: THTMLTextarea['placeholder']
	ref?: React.Ref<HTMLTextAreaElement>
} & THTMLTextarea & SCompProps.TBase;

export const Textarea = (
	{withLabel = undefined, id, placeholder, className, ...props}: TProps
): React.ReactNode => {
	return (
		<>
			{withLabel ? (
				<div className={cx(
					'flex-col flex w-full group relative'
				)}>
					<textarea id={id} placeholder={withLabel ? '' : placeholder} {...props} className={merge(
						{'peer': withLabel},
						inputStyles,
						className,
					)}/>
					{withLabel &&
						<Label id={id}>{withLabel}</Label>
					}
				</div>
			) : (
				<textarea id={id} placeholder={withLabel ? '' : placeholder} {...props} className={merge(
					{'peer': withLabel},
					inputStyles,
					className,
				)}/>
			)}
		</>

	)
}