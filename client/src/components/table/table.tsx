"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

type TProps = {
	contained?: boolean
} & SCompProps.TBase<true> & MotionProps;

export function Table (
	{contained = false, className, children, variants, ...props}: TProps): React.ReactNode
{
	return (
		<motion.div className={"overflow-auto relative group"} variants={variants}>
			<motion.table className={merge(
				"c-trans-4 group-[:not(:first-child)]:first:border-t group-[:not(:last-child)]:border-b padding-t w-full",
				"border-zinc-200",
				"dark:border-gray-700",
				{'table-fixed': contained},
				className,
			)} variants={variants} {...props}>
				{children}
			</motion.table>
		</motion.div>
	)
}