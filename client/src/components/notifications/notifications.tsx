"use client";

import React, {ReactNode, useContext} from "react";
import {AnimatePresence, motion} from "motion/react";

import {NotificationContext} from "@ctx/notification/notification.context";

import {Notification} from "@comp/notification";

import {variants} from "@comp/notifications/notifications.anim";

export function Notifications (): ReactNode {
	const {notifications, clearOne, add} = useContext(NotificationContext);
	
	return (
		<motion.div className={"flex flex-col fixed bottom-4 right-4 gap-4"}>
			<AnimatePresence>
				{notifications.map(({type, title, message, content, dismissible, timestamp}, index) => (
					<Notification initial={variants.hidden} animate={variants.show} exit={variants.hidden} layout
					              key={timestamp!.toString()} type={type} title={title} timestamp={timestamp} onDismiss={dismissible ? () => clearOne(timestamp!) : undefined}>
						{content||message}
					</Notification>
				))}
			</AnimatePresence>
		</motion.div>
	)
}