"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

type TProps = SCompProps.TBase<true> & MotionProps;

export function TableRow ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.tr className={merge(
			'c-trans-4',
			'even:bg-zinc-100/50',
			'dark:even:bg-gray-900/50',
			className,
		)} {...props}>
			{children}
		</motion.tr>
	)
}