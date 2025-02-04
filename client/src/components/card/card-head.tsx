"use client";

import React from "react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";
import {MotionProps} from "motion/react";

import {textColor} from "style/common-classes";

type TProps = {
	flex?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const CardHead = (
	{flex = true, className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<div className={merge(
			'p-8',
			{'flex flex-col gap-4': flex},
			textColor,
			className,
		)} {...props}>
			{children}
		</div>
	)
}