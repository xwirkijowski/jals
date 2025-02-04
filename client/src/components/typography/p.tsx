"use client";

import React from "react";
import {motion} from "motion/react";

import {merge} from "@lib/merge";

import {TProps, styles} from "@comp/typography/common";

export const P = (
	{align, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<motion.p className={merge(
			'text-zinc-600',
			'dark:text-gray-300',
			(align && `text-${align}`),
			styles,
			className,
		)} {...props}>
			{children}
		</motion.p>
	)
}