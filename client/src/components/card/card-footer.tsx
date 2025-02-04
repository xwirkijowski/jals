"use client";

import React from "react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";
import {MotionProps} from "motion/react";

import {textColor} from "style/common-classes";

type TProps = {} & SCompProps.TBase<true> & SCompProps.THTMLDiv<["className"]> & MotionProps

export const CardFooter = (
	{className, children, ...props}: TProps
): React.ReactNode => {
	return (
		<div className={merge(
			'col-span-full flex gap-8 p-8 justify-between items-center',
			textColor,
			className,
		)} {...props}>
			{children}
		</div>
	)
}