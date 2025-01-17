"use client";

import cx from "classnames";
import React from "react";

type TProps = {
	grid?: boolean
	className?: string
	children?: React.ReactNode
}

export const CardBody = (
	{grid, className, children}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'p-8 border-y w-full gap-4 c-trans-4 border-zinc-900/15',
			(grid && 'grid grid-cols-2'),
			'dark:border-white/10',
			className,
		)}>
			{children}
		</div>
	)
}