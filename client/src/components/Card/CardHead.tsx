"use client";

import cx from "classnames";
import React from "react";

type TProps = {
	className?: string
	children?: React.ReactNode
}

export const CardHead = (
	{className, children}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'p-8',
			className,
		)}>
			{children}
		</div>
	)
}