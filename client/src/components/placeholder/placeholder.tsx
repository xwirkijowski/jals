"use client";

import React from "react";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

type TProps = {
	width?: number | string;
} & SCompProps.TBase

export function Placeholder ({width, className}: TProps): React.ReactNode {
	return (
		<span className={merge(
			"block !opacity-100 animate-placeholder rounded-md",
			{[`w-[${width}]`]: (width && typeof width === "number")},
			{[`w-${width}`]: (width && typeof width === "string")},
			className
		)}>&nbsp;</span>
	)
}