"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";
import cx from "classnames";
import Link from "next/link";

import {SCompProps} from "@type/common";

type TProps = {
	href: string
	bold?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLButton<["className"]> & MotionProps;

export function Anchor ({className, href, bold = false, type = 'button', children, ...props}: TProps): React.ReactNode {
	return (
		<Link passHref href={href}>
			<motion.button
				type={type}
				className={cx(
					'text-orange-500 hover:text-orange-400 trans underline !underline-offset-2',
					{'font-bold': bold},
					className,
				)}
				{...props}
			>{children}</motion.button>
		</Link>
	)
}