'use client';

import {usePathname, useRouter} from "next/navigation";
import {useActionState, useContext, useEffect} from "react";
import {LogOutAction} from "./LogOIut.action";

// Components
import {Button} from "@comp/button";
import {Spinner} from "@comp/spinner";
import {NotificationContext} from "@ctx/notification/notification.context";

export const LogOutButton = () => {
	const router = useRouter(),
		  path = usePathname();
	const [state, action, pending] = useActionState(LogOutAction, undefined);
	const {add} = useContext(NotificationContext);
	
	useEffect(() => {
		if (!pending && state?.result?.success) {
			add({
				type: 'success',
				title: ("Logged out successfully!"),
				dismissible: false,
			})
			
			if (path !== '/') {
				router.push('/')
			}
		}
	}, [pending, state?.result?.success])

	return (
		<Button onClick={action} btnType={'theme'}>{pending ? (<Spinner/>) : ("Log Out")}</Button>
	)
}