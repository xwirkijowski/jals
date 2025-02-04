"use client";

import React from "react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";
import {MotionProps} from "motion/react";

import {textColor} from "style/common-classes";

type TProps = {
	grid?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const CardBody = (
	{grid, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<div className={merge(
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