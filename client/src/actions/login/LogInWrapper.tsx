"use client";

import {ReactNode, useActionState, useContext, useEffect} from "react";

import {Container} from "@comp/container/container";
import {LogInRequestForm} from "@act/login/stage1/LogInRequest.form";
import {LogInRequestAction} from "@act/login/stage1/LogInRequest.action";
import {LogInForm} from "@act/login/stage2/LogIn.form";
import {LogInAction} from "@act/login/stage2/LogIn.action";
import {NotificationContext} from "@ctx/notification/notification.context";

import {TActionPropsMode} from "@act/shared/common.types";
import {TResponse} from "@type/data/response";

export const LogInWrapper = ({mode}: TActionPropsMode): ReactNode => {
	const {add} = useContext(NotificationContext);
	const [state1, action1, pending1] = useActionState(LogInRequestAction, undefined);
	const [state2, action2, pending2] = useActionState(LogInAction.bind(null, {email: state1?.email}), undefined);
	
	useEffect(() => {
		if (!pending2 && (state2 as unknown as TResponse['data'])?.result?.success) {
			add({
				type: 'success',
				title: ("Logged in successfully!"),
				dismissible: false,
			})
		}
	}, [pending2, state2]);
	
	
	return (
		<>
			{(!state1?.result?.success) ? (
				<Container>
					<LogInRequestForm mode={mode} action={action1} state={state1} pending={pending1} />
				</Container>
			) : (
				<Container>
					<LogInForm mode={mode} action={action2} state={state2} pending={pending2}/>
				</Container>
			)}
		</>
	)
}
