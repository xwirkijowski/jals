"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

type TProps = SCompProps.TBase<true> & MotionProps;

export function TableRow ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.tr className={cx(
			'c-trans-4',
			'even:bg-zinc-100/50',
			'dark:even:bg-gray-900/50',
			className,
		)} {...props}>
			{children}
		</motion.tr>
	)
}