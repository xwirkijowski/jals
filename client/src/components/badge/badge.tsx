"use client";

import cx from "classnames";
import React from "react";
import {motion} from "motion/react";

import {styles} from "@comp/badge/badge.styles";
import {TBadgeProps} from "@comp/badge/badge.types";

import {Ping} from "@comp/ping";

export const Badge = (
	{tooltip = false, ping = false, size = 'md', badgeType = 'light', className, children, ...props}: TBadgeProps
): React.ReactNode => {
	return (
		<motion.button disabled={!tooltip} {...props} className={cx(
			'c-trans-4 border font-bold flex flex-row items-center rounded-full text-nowrap overflow-hidden shadow-none',
			'shadow-md shadow-transparent w-fit',
			'dark:shadow-gray-900/20',
			{'gap-2	py-1 px-2 text-sm/none': size === 'sm'},
			{'gap-2	py-1 px-2 text-sm': size === 'md'},
			{'gap-2	py-1 px-2 text-sm/loose': size === 'lg'}, // @todo: Adjust
			{'cursor-help': tooltip},
			styles[badgeType],
			className,
        )}>
			{ping && <Ping pingType={badgeType} />}
			{children}
		</motion.button>
	)
}