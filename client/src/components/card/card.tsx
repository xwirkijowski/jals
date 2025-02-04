"use client";

import cx from "classnames";
import React from "react";
import {twMerge} from 'tailwind-merge';

import {motion, MotionProps} from "motion/react";

import {SCompProps} from "@type/common";
import {textColor} from "style/common-classes";

type TProps = {
	structured?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const Card = (
	{structured = false, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<motion.div className={twMerge(cx(
			'w-full flex flex-col c-trans-4',
			'text-left max-w-xl shadow-sm rounded-xl border border-transparent',
			{'p-8 gap-4': !structured},
			'text-md bg-white shadow-zinc-900/20 border-zinc-200',
			'dark:bg-gray-800 dark:shadow-gray-900/20 dark:border-gray-700',
			textColor,
			className,
		))} {...props}>
			{children}
		</motion.div>
	)
}