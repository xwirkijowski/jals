"use client";

import {ReactNode, useActionState, useContext, useEffect} from "react";

import {NotificationContext} from "@ctx/notification/notification.context";

import {Container} from "@comp/container/container";
import {RegisterRequestForm} from "@act/register/stage1/RegisterRequest.form";
import {RegisterRequestAction} from "@act/register/stage1/RegisterRequest.action";
import {RegisterForm} from "@act/register/stage2/Register.form";
import {RegisterAction} from "@act/register/stage2/Register.action";

import {TActionPropsMode} from "@act/shared/common.types";
import {TResponse} from "@type/data/response";

export const RegisterWrapper = ({mode}: TActionPropsMode): ReactNode => {
	const {add} = useContext(NotificationContext);
	const [state1, action1, pending1] = useActionState(RegisterRequestAction, undefined);
	const [state2, action2, pending2] = useActionState(RegisterAction.bind(null, {email: state1?.email}), undefined);
	
	useEffect(() => {
		if (!pending2 && (state2 as unknown as TResponse['data'])?.result?.success) {
			add({
				type: 'success',
				title: ("Registered successfully!"),
				content: ("You are now logged in to your new account."),
				dismissible: false,
			})
		}
	}, [pending2, state2]);
	
	return (
		<>
			{(!state1?.result?.success) ? (
				<Container>
					<RegisterRequestForm mode={mode} action={action1} state={state1} pending={pending1} />
				</Container>
			) : (
				<Container>
					<RegisterForm mode={mode} action={action2} state={state2} pending={pending2}/>
				</Container>
			)}
		</>
	)
}
