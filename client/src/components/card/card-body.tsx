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
			'p-8 border-y w-full gap-4 c-trans-4 border-zinc-900/15',
			(grid ? 'grid grid-cols-2' : 'flex flex-col'),
			'dark:border-gray-700',
			className,
		)} {...props}>
			{children}
		</div>
	)
}