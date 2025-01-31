"use client";

import cx from "classnames";
import React from "react";
import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";
import {textColor} from "../../style/common-classes";

type TProps = {
	grid?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const CardBody = (
	{grid, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'p-8 [&:not(:last-child)]:border-b [&:not(:first-child)]:border-t w-full gap-4 c-trans-4 border-zinc-200',
			(grid ? 'grid grid-cols-2' : 'flex flex-col'),
			'dark:border-gray-700',
			textColor,
			className,
		)} {...props}>
			{children}
		</div>
	)
}