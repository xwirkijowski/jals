"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";
import {textColor} from "style/common-classes";

export type TCardProps = {
	structured?: boolean
	contained?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const Card = (
	{structured = false, contained = true, className, children, ...props}: TCardProps
): React.ReactNode => {
	return (
		<motion.div className={merge(
			'w-full flex flex-col c-trans-4',
			'text-left  shadow-sm rounded-xl border border-transparent',
			{'p-8 gap-4': !structured},
			{'max-w-xl': contained},
			'text-md bg-white shadow-zinc-900/20 border-zinc-200',
			'dark:bg-gray-800 dark:shadow-gray-900/20 dark:border-gray-700',
			textColor,
			className,
		)} {...props}>
			{children}
		</motion.div>
	)
}