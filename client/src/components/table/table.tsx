"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

type TProps = SCompProps.TBase<true> & MotionProps;

export function Table ({className, children, variants, ...props}: TProps): React.ReactNode {
	return (
		<motion.div className={"overflow-auto relative group"} variants={variants}>
			<motion.table className={cx(
				"c-trans-4 group-[:not(:first-child)]:first:border-t group-[:not(:last-child)]:border-b padding-t w-full",
				"border-zinc-200",
				"dark:border-gray-700",
				className,
			)} variants={variants} {...props}>
				{children}
			</motion.table>
		</motion.div>
	)
}