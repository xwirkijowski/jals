"use client";

import React, {useActionState} from "react";

import {RegisterRequestForm} from "@act/register/stage1/RegisterRequest.form";
import {RegisterRequestAction} from "@act/register/stage1/RegisterRequest.action";
import {RegisterForm} from "@act/register/stage2/Register.form";
import {RegisterAction} from "@act/register/stage2/Register.action";

import {TActionPropsMode} from "@act/shared/common.types";

export const RegisterWrapper = ({mode}: TActionPropsMode): React.ReactNode => {
	// Request auth code action
	const [state1, action1, pending1] = useActionState(RegisterRequestAction, undefined);
	// Actual register action
	const [state2, action2, pending2] = useActionState(RegisterAction.bind(null, {email: state1?.email}), undefined);

	return (
		<>
			{(!state1?.result?.success) ? (
				<div className="flex flex-col justify-center items-center flex-1 gap-8">
					<RegisterRequestForm mode={mode} action={action1} state={state1} pending={pending1} />
				</div>
			) : (
				<div className="flex flex-col justify-center items-center flex-1 gap-8">
					<RegisterForm mode={mode} action={action2} state={state2} pending={pending2}/>
				</div>
			)}
		</>
	)
}
