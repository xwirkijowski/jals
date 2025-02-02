"use client";

import cx from "classnames";
import {ReactNode} from "react";

import {useAnimation} from "motion/react";
import {CloseIcon} from "@comp/Icon/Close";

import {SCompProps} from "@type/common";
import {ENotificationType} from "@comp/notification/notification.types";

export const styles: Record<keyof typeof ENotificationType, string> = {
	primary: 'text-white bg-orange-700 hover:bg-orange-800',
	success: 'text-white bg-green-700 hover:bg-green-800',
	info: 'text-white bg-blue-700 hover:bg-blue-800',
	warning: 'text-white bg-orange-700 hover:bg-orange-800',
	danger: 'text-white bg-red-700 hover:bg-red-800',
	light: 'text-zinc-600 bg-zinc-300 hover:bg-zinc-400',
	dark: 'text-white bg-zinc-900 hover:bg-zinc-800',
}

type TProps = {
	type: keyof typeof ENotificationType,
	onClick: () => void;
} & SCompProps.TBase

export function NotificationClose ({type, onClick, className}: TProps): ReactNode {
	const controls = useAnimation();
	
	return (
		<button onMouseEnter={() => controls.start('animate')}
		        onMouseLeave={() => controls.start('normal')}
		        onClick={onClick}
		        className={cx(
					'flex flex-0 bg-inherit c-trans p-1 rounded-md place-self-end',
			        styles[type],
					className
		        )}
		>
			<CloseIcon controls={controls} />
		</button>
	)
}