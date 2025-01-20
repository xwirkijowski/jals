import cx from "classnames";
import React from "react";

type TProps = {
	id?: string
	children?: React.ReactNode
}

export const Label = ({id, children}: TProps): React.ReactNode => {
	return (
		<label htmlFor={id} className={cx(
			'absolute bg-white px-0.5 py-0 left-3.5 top-3 mt-[1px] rounded-md block text-md text-zinc-400',
			'trans',
			'pointer-events-none',
			`group-focus-within:top-[-.75em] group-focus-within:text-sm group-focus-within:text-orange-500`,
			`peer-valid:top-[-.75em] peer-valid:text-sm`,
			`peer-[:not(:placeholder-shown)]:top-[-.75em] peer-[:not(:placeholder-shown)]:text-sm`,
			'peer-[:invalid:not(:placeholder-shown)]:!text-red-500',
			'peer-valid:!text-green-500',
			'dark:bg-gray-800 dark:text-gray-400',
		)}>{children}</label>
	)
}