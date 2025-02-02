"use client";

import cx from 'classnames';
import {ReactNode} from "react";
import {motion} from "motion/react";

import {ENotificationType} from "@comp/notification/notification.types";

export const styles: Record<keyof typeof ENotificationType, string> = {
	primary: 'bg-orange-700',
	success: 'bg-green-700',
	info: 'bg-blue-700',
	warning: 'bg-orange-700',
	danger: 'bg-red-700',
	light: 'bg-zinc-300',
	dark: 'bg-zinc-900',
}

type TProps = {
	time: number
	type: keyof typeof ENotificationType
}

export function NotificationTimer ({time, type}: TProps):ReactNode  {
	return (
		<motion.span
			className={cx("absolute w-full bottom-0 left-0 h-1", styles[type])}
			animate={{
				width: 0,
				transition: {
					duration: time
				}
			}}
		></motion.span>
	)
}