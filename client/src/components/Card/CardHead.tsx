"use client";

import cx from "classnames";
import React from "react";
import {SCompProps} from "@type/common";

type TProps = {
	flex?: boolean
} & SCompProps.TBase<true>

export const CardHead = (
	{flex = true, className, children}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'p-8',
			{'flex flex-col gap-4': flex},
			className,
		)}>
			{children}
		</div>
	)
}