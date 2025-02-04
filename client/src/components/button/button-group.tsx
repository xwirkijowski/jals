"use client";

import {SCompProps} from "@type/common";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

type TProps = {
	joined?: boolean,
	gap?: number
} & SCompProps.TBase<true> & MotionProps

export function ButtonGroup (
	{gap = 4, joined = false, children, className, ...props}: TProps) {
	return (
		<motion.div className={merge(
			`flex flex-row items-center`,
			{[`gap-${gap}`]: (gap && !joined)},
			className
		)} {...props}>
			{children}
		</motion.div>
	)
}