"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";
import {SCompProps} from "@type/common";
import {HTMLMotionProps} from "framer-motion";

type TProps = {
	structured?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & HTMLMotionProps<'div'>

export const Card = (
	{structured = false, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<motion.div className={cx(
			'w-full flex flex-col c-trans-4',
			'flex flex-col text-left w-full max-w-xl shadow-xl rounded-xl border border-transparent',
			{'p-8 gap-4': !structured},
			'text-md text-zinc-900 bg-white shadow-zinc-900/20 border-zinc-900/15',
			'dark:bg-gray-800 dark:shadow-gray-900/20 dark:border-gray-700',
			className,
		)} {...props}>
			{children}
		</motion.div>
	)
}