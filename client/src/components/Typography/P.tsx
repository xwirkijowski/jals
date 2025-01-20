"use client";

import cx from "classnames";
import React from "react";
import {TProps, typographyStyles} from "@comp/Typography/common";

export const P = (
	{align, className, children}: TProps
): React.ReactNode => {
	return (
		<p className={cx(
			'text-zinc-600',
			'dark:text-gray-300',
			(align && `text-${align}`),
			typographyStyles,
			className,
		)}>
			{children}
		</p>
	)
}