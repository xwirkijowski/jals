'use client';

import {useRouter} from "next/navigation";
import {useActionState} from "react";
import {LogOutAction} from "./LogOIut.action";

// Components
import {Button} from "@comp/Button";
import {Spinner} from "@comp/Spinner";


export const LogOutButton = () => {
	const router = useRouter()
	const [state, action, pending] = useActionState(LogOutAction, undefined);

	if (!pending && state?.result?.success) {
		router.push('/'); // @todo Add history detection to avoid leaving site
	}

	return (
		<Button onClick={action} btnType={'theme'}>{pending ? (<Spinner/>) : ("Log Out")}</Button>
	)
}