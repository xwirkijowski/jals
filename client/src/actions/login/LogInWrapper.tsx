"use client";

import React, {useActionState} from "react";

import {Container} from "@comp/Container/Container";
import {LogInRequestForm} from "@act/login/stage1/LogInRequest.form";
import {LogInRequestAction} from "@act/login/stage1/LogInRequest.action";
import {LogInForm} from "@act/login/stage2/LogIn.form";
import {LogInAction} from "@act/login/stage2/LogIn.action";

import {TActionPropsMode} from "@act/shared/common.types";

export const LogInWrapper = ({mode}: TActionPropsMode): React.ReactNode => {
	// Request auth code action
	const [state1, action1, pending1] = useActionState(LogInRequestAction, undefined);
	// Actual login action
	const [state2, action2, pending2] = useActionState(LogInAction.bind(null, {email: state1?.email}), undefined);

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
