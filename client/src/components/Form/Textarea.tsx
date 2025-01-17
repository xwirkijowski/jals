import React from "react";
import cx from "classnames";

import {Label} from "@comp/Form/Label";
import {inputStyles} from "@comp/Form/common.styles";

type THTMLTextarea = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type TProps = {
	withLabel?: string
	id?: THTMLTextarea['id']
	className?: string
	placeholder?: THTMLTextarea['placeholder']
} & THTMLTextarea;

export const Textarea = (
	{withLabel = undefined, id, placeholder, className, ...props}: TProps
): React.ReactNode => {
	return (
		<>
			{withLabel ? (
				<div className={cx(
					'flex-col flex w-full group relative'
				)}>
					<textarea id={id} placeholder={withLabel ? '' : placeholder} {...props} className={cx(
						{'peer': withLabel},
						inputStyles,
						className,
					)}/>
					{withLabel &&
						<Label id={id}>{withLabel}</Label>
					}
				</div>
			) : (
				<textarea id={id} placeholder={withLabel ? '' : placeholder} {...props} className={cx(
					{'peer': withLabel},
					inputStyles,
					className,
				)}/>
			)}
		</>

	)
}