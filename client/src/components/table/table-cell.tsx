"use client";

import React from "react";
import {motion, MotionProps} from "motion/react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

import {textColor} from "style/common-classes";
import {cell} from "@comp/table/common.styles";

type TProps = SCompProps.TBase<true> & SCompProps.THTMLTableCell<["className"]> & MotionProps;

export function TD ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.td className={merge(
			cell,
			textColor,
			className,
		)} {...props}>
			{children}
		</motion.td>
	)
}