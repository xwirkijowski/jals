"use client";

import React from "react";
import {motion} from "motion/react";

import {merge} from "@lib/merge";

import {TProps, styles} from "@comp/typography/common";

export const H3 = (
	{align, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<motion.h3 className={merge(
			'font-bold text-base/tight sm:text-base/tight',
			(align && `text-${align}`),
			styles,
			className,
			'text-zinc-900',
			'dark:text-zinc-100',
		)} {...props}>
			{children}
		</motion.h3>
	)
}