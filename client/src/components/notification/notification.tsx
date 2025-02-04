"use client";

import React, {useContext, useEffect} from 'react';
import {motion} from "motion/react";

import {merge} from "@lib/merge";

import {NotificationContext} from "@ctx/notification/notification.context";

import {styles} from "@comp/notification/notification.styles";
import {TNotificationProps} from "@comp/notification/notification.types";
import {NotificationClose} from "@comp/notification/notification-close";
import {NotificationTimer} from "@comp/notification/notification-timer";

const defaultTimeout = 10; // 10000ms

export const Notification = (
	{title, type = 'light', onDismiss, timeout, timestamp, className, children, ...props}: TNotificationProps
): React.ReactNode => {
	const {clearOne} = useContext(NotificationContext);
	const [count, setCount] = React.useState<null|number>(null);
	
	const initialCount: number = timeout ?? defaultTimeout;
	
	useEffect(() => {
		if (!onDismiss) {
			// Not dismissible === on timeout
			setCount(initialCount)
		}
	}, []);
	
	useEffect(() => {
		if (count !== null) {
			const interval = setInterval(() => {
				setCount(count - 1);
			}, 1000);
			
			return () => clearInterval(interval);
		}
	}, [count]);
	
	useEffect(() => {
		if (timestamp && count === 0) clearOne(timestamp!);
	}, [count, timestamp]);
	
	return (
		<motion.div className={merge(
			"max-w-xl py-3 px-4 shadow-xl rounded-xl text-base w-full flex flex-row gap-4 overflow-hidden relative **:!text-current dark:**:!text-current",
			styles[type],
			className,
		)} role="alert" {...props}>
			{title ? (
				<motion.div className={'flex flex-col gap-1'}>
					<p className={"font-bold text-base"}>{title}</p>
					{children}
				</motion.div>
			) : (<>{children}</>)}
			{onDismiss && <NotificationClose type={type} onClick={onDismiss}></NotificationClose>}
			{count && <NotificationTimer type={type} time={initialCount} />}
		</motion.div>
	)
}