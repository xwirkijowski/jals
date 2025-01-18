"use client";

import cx from "classnames";
import React from "react";

import {TBadgeType} from "@comp/Badge/Badge.types";
import {SCompProps} from "@type/common";

const typeStyles: Record<TBadgeType, Array<string>|string> = {
	primary: 'bg-orange-500 before:bg-orange-500',
	success: 'bg-green-500 before:bg-green-500',
	info: 'bg-blue-500 before:bg-blue-500',
	warning: 'bg-red-500 before:bg-red-500',
	danger: 'bg-red-500 before:bg-red-500',
	light: [
		'bg-zinc-500 before:bg-zinc-500',
		'dark:bg-zinc-500 dark:before:bg-zinc-500',
	],
	dark: [
		'bg-zinc-100 before:bg-zinc-100',
		'dark:bg-zinc-400 dark:before:bg-zinc-400',
	],
	theme: '',
	themeInverse: '',
}

typeStyles.theme = [typeStyles.light[0], typeStyles.dark[1]];
typeStyles.themeInverse = [typeStyles.dark[0], typeStyles.light[1]];

type TProps = {
	pingType?: TBadgeType
} & SCompProps.TBase

export const Ping = (
	{pingType = 'light'}: TProps
): React.ReactNode => {
	return (
		<span className={cx(
			'h-3 w-3 block rounded-full',
			'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
			typeStyles[pingType],
		)} />
	)
}