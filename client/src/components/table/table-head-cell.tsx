"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

import {cell} from "@comp/table/common.styles";
import {textColor} from "style/common-classes";

type TProps = SCompProps.TBase<true> & SCompProps.THTMLTableCell<["className"]> & MotionProps;

export function TH ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.th className={cx(
			'text-nowrap',
			cell,
			textColor,
			className,
		)} {...props}>
			{children}
		</motion.th>
	)
}