"use client";

import cx from "classnames";
import React from "react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";
import {textColor} from "../../style/common-classes";

type TProps = {} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const CardFooter = (
	{className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'col-span-full flex gap-8 p-8 justify-between items-center',
			textColor,
			className,
		)} {...props}>
			{children}
		</div>
	)
}