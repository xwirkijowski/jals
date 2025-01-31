"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";

import {TProps, styles} from "@comp/typography/common";

export const H1 = (
	{align, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<motion.h1 className={cx(
			'font-bold text-2xl/tight sm:text-5xl/tight',
			(align && `text-${align}`),
			styles,
			className,
			'text-zinc-900',
			'dark:text-zinc-100',
		)} {...props}>
			{children}
		</motion.h1>
	)
}