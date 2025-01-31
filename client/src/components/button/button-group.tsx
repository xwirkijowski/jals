"use client";

import {SCompProps} from "@type/common";
import {motion, MotionProps} from "motion/react";
import cx from "classnames";

type TProps = {
	joined?: boolean,
	gap?: number
} & SCompProps.TBase<true> & MotionProps

export function ButtonGroup (
	{gap = 4, joined = false, children, className, ...props}: TProps) {
	return (
		<motion.div className={cx(
			`flex flex-row items-center`,
			{[`gap-${gap}`]: (gap && !joined)},
			className
		)} {...props}>
			{children}
		</motion.div>
	)
}