"use client";

import cx from 'classnames';
import React from "react";
import {motion} from "motion/react";

import {container} from "@lib/motion/stagger.fly";

// Types
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

type TProps = {
	gap?: number
	direction?: 'row' | 'col'
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const Container = (
	{className, gap = 8, direction = "col", children, ...props}: TProps
): React.ReactNode => {
	return (
		// @ts-ignore: Motion issue with duplicate declaration
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className={cx([
				"flex justify-center items-center text-left flex-1",
				`gap-${gap} flex-${direction}`,
				className,
			])}
			{...props}
		>
			{children}
		</motion.div>
	)
}