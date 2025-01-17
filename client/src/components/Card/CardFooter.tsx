"use client";

import cx from "classnames";
import React from "react";

type TProps = {
	className?: string
	children?: React.ReactNode
}

export const CardFooter = (
	{className, children}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'col-span-full flex gap-8 p-8 justify-between items-center',
			className,
		)}>
			{children}
		</div>
	)
}