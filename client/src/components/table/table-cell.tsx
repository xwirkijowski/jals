"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";
import {textColor} from "style/common-classes";

import {cell} from "@comp/table/common.styles";

type TProps = SCompProps.TBase<true> & SCompProps.THTMLTableCell<["className"]> & MotionProps;

export function TD ({className, children, ...props}: TProps): React.ReactNode {
	return (
		<motion.td className={cx(
			cell,
			textColor,
			className,
		)} {...props}>
			{children}
		</motion.td>
	)
}