"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

import {cell} from "@comp/table/common.styles";
import {textColor} from "style/common-classes";

type TProps = SCompProps.TBase<true> & SCompProps.THTMLTableCell<["className"]> & MotionProps;

export function TH ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.th className={merge(
			'text-nowrap',
			cell,
			textColor,
			className,
		)} {...props}>
			{children}
		</motion.th>
	)
}