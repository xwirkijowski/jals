"use client";

import React, {useContext} from "react";

import {merge} from "@lib/merge";

import {ThemeContext} from "@ctx/theme/theme.context";

type TProps = {
	children: React.ReactNode;
	className?: string;
}

export const Body = ({children, className}: TProps): React.ReactNode => {
	const {theme} = useContext(ThemeContext);
	
	return (
		<body className={merge(
			theme,
			className,
			'flex items-center justify-center min-h-screen',
			'bg-white text-zinc-900',
			'dark:bg-gray-900 dark:text-zinc-100',
			'c-trans-4',
		)}>
			{children}
		</body>
	)
}