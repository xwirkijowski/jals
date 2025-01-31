"use client";

import cx from "classnames";
import React from "react";

import {SCompProps} from "@type/common";

import {EPingType} from "@comp/ping/ping.types";
import {styles} from "@comp/ping/ping.styles";

type TProps = {
	pingType?: keyof typeof EPingType
} & SCompProps.TBase

export const Ping = (
	{pingType = 'light'}: TProps
): React.ReactNode => {
	return (
		<span className={cx(
			'h-3 w-3 block rounded-full',
			'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
			styles[pingType],
		)} />
	)
}