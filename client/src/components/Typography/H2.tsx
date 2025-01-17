"use client";

import cx from "classnames";
import React from "react";
import {TProps, typographyStyles} from "@comp/Typography/common";

export const H2 = (
	{align, className, children}: TProps
): React.ReactNode => {
	return (
		<h2 className={cx(
			'font-bold text-2xl/tight sm:text-2xl/tight',
			(align && `text-${align}`),
			typographyStyles,
			className,
			'text-zinc-900',
			'dark:text-zinc-100',
		)}>
			{children}
		</h2>
	)
}