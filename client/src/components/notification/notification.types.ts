import React from "react";
import {SCompProps} from "@type/common";
import {MotionProps} from "motion/react";

export enum ENotificationType {
	primary = 'primary',
	success = 'success',
	info = 'info',
	warning = 'warning',
	danger = 'danger',
	light = 'light',
	dark = 'dark',
}

export type TNotificationProps = {
	title?: string,
	type?: keyof typeof ENotificationType,
	onDismiss?: () => void,
	timeout?: number;
	timestamp?: number,
} & React.HTMLAttributes<HTMLDivElement> & SCompProps.TBase<true> & MotionProps