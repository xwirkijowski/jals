"use client";

import {createContext, PropsWithChildren, ReactNode, useCallback, useState} from "react";

import {ENotificationType} from "@comp/notification/notification.types";

type TNotification = {
	type: keyof typeof ENotificationType;
	title?: string;
	message?: string;
	content?: ReactNode;
	dismissible?: boolean;
	timestamp?: number;
}

interface INotificationContext {
	notifications: Array<TNotification>
	clearAll: () => void
	clearOne: (timestamp: number) => void
	add: (notification: TNotification) => void
}

export const NotificationContext = createContext<INotificationContext>({
	notifications: [],
	clearAll: () => {},
	clearOne: (timestamp: number) => {},
	add: (notification: TNotification) => {},
});

export function NotificationProvider ({children}: PropsWithChildren): ReactNode {
	const [notifications, setNotifications] = useState<Array<TNotification>>([]);
	
	const clearAll = useCallback(() => {
		setNotifications([]);
	}, [notifications]);
	
	const clearOne = useCallback((timestamp: number) => {
		setNotifications(notifications => [
			...notifications.filter((notification: TNotification) => notification.timestamp !== timestamp)
		]);
	}, [notifications]);
	
	const add = useCallback((notification: TNotification) => {
		notification.timestamp = Date.now();
		
		setNotifications(notifications => [...notifications, notification]);
	}, [notifications])
	
	const providerValue = {
		notifications,
		clearAll,
		clearOne,
		add,
	}
	
	return (
		<NotificationContext value={providerValue}>
			{children}
		</NotificationContext>
	)
}