"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

type TProps = SCompProps.TBase<true> & MotionProps;

export function TableHead ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.thead className={cx(
			'c-trans-4 border-b',
			'bg-zinc-100 border-zinc-200',
			'dark:bg-gray-900 dark:border-gray-700',
			className,
		)} {...props}>
			{children}
		</motion.thead>
	)
}