"use client"

import React, {useContext, useEffect} from "react";
import {NotificationContext} from "@ctx/notification/notification.context";
import {useRouter} from "next/navigation";

export function ServersideNofify ({action, route}) {
	const {add} = useContext(NotificationContext);
	const router = useRouter();
	
	useEffect(() => {
		switch (action) {
			case "no-link":
				add({
					type: 'danger',
					title: "Oops!",
					content: (<p>This link does not exists. Maybe you already deleted it?</p>),
					dismissible: false,
				})
				
				router.push('/route')
				break;
		}
	});
	
	return null;
}