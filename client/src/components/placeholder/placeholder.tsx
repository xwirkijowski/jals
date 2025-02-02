"use client";

import React from "react";
import cx from "classnames";
import {SCompProps} from "@type/common";

type TProps = {
	width?: number | string;
} & SCompProps.TBase

export function Placeholder ({width, className}: TProps): React.ReactNode {
	return (
		<span className={cx(
			"block !opacity-100 animate-placeholder rounded-md",
			{[`w-[${width}]`]: (width && typeof width === "number")},
			{[`w-${width}`]: (width && typeof width === "string")},
			className
		)}>&nbsp;</span>
	)
}