'use client';


import {useRouter} from "next/navigation";
import {useActionState} from "react";
import {LogOutAction} from "./LogOIut.action";
import Button from "@comp/Button/Button";
import {Spinner} from "@comp/Spinner/Spinner";

// Components


export const LogOutButton = () => {
	const router = useRouter()
	const [state, action, pending] = useActionState(LogOutAction, undefined);

	if (!pending && state?.result?.success) {
		router.refresh();
	}

	return (
		<Button onClick={action} btnType={'light'}>{pending ? (<Spinner/>) : ("Log Out")}</Button>
	)
}