"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

type TProps = SCompProps.TBase<true> & MotionProps;

export function TableHead ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.thead className={merge(
			'c-trans-4 border-b',
			'bg-zinc-100 border-zinc-200',
			'dark:bg-gray-900 dark:border-gray-700',
			className,
		)} {...props}>
			{children}
		</motion.thead>
	)
}