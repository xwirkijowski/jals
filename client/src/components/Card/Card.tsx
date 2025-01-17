"use client";

import cx from "classnames";
import React from "react";

type TProps = {
	structured?: boolean
	className?: string
	children?: React.ReactNode
}

export const Card = (
	{structured = false, className, children}: TProps
): React.ReactNode => {
	return (
		<div className={cx(
			'w-full flex flex-col c-trans-4',
			'flex flex-col text-left w-full max-w-xl shadow-xl rounded-xl',
			{'p-8 gap-4': !structured},
			'text-md text-zinc-900 bg-white shadow-zinc-900/20',
			'dark:bg-gray-800',
			className,
		)}>
			{children}

		</div>
	)
}