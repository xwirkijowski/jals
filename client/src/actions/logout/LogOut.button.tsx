'use client';

import {useRouter} from "next/navigation";
import {useActionState, useContext} from "react";
import {LogOutAction} from "./LogOIut.action";
import {ThemeContext} from "../../contexts/theme/theme.context";

// Components
import Button from "@comp/Button/Button";
import {Spinner} from "@comp/Spinner/Spinner";


export const LogOutButton = () => {
	const router = useRouter()
	const [state, action, pending] = useActionState(LogOutAction, undefined);
	const {theme} = useContext(ThemeContext);

	if (!pending && state?.result?.success) {
		router.back();
	}

	return (
		<Button onClick={action} btnType={theme}>{pending ? (<Spinner/>) : ("Log Out")}</Button>
	)
}