"use client";

import cx from "classnames";
import React from "react";
import {SCompProps} from "@type/common";
import {HTMLMotionProps} from "framer-motion";

type TProps = {} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & HTMLMotionProps<'div'>

export const CardFooter = (
	{className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'col-span-full flex gap-8 p-8 justify-between items-center',
			className,
		)} {...props}>
			{children}
		</div>
	)
}