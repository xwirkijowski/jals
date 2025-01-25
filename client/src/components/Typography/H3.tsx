"use client";

import cx from "classnames";
import React from "react";
import {TProps, styles} from "@comp/Typography/common";

export const H3 = (
	{align, className, children}: TProps
): React.ReactNode => {
	return (
		<h3 className={cx(
			'font-bold text-base/tight sm:text-base/tight',
			(align && `text-${align}`),
			styles,
			className,
			'text-zinc-900',
			'dark:text-zinc-100',
		)}>
			{children}
		</h3>
	)
}