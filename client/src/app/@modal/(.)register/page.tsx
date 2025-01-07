"use client";

import React, {useActionState} from "react";

import {ModalWrapper} from "@comp/Modal/Wrapper";

import {RegisterRequestForm} from "actions/register/stage1/RegisterRequest.form";
import {RegisterRequestAction} from "actions/register/stage1/RegisterRequest.action";
import {RegisterForm} from "actions/register/stage2/Register.form";
import {RegisterAction} from "actions/register/stage2/Register.action";

export default () => {
    const [state1, action1, pending1] = useActionState(RegisterRequestAction, undefined);
    const [state2, action2, pending2] = useActionState(RegisterAction.bind(null, {email: state1?.email}), undefined);

    return (
        <ModalWrapper>
            {(!state1 || state1.result.success === false) ? (
                <div className="flex flex-col justify-center items-center flex-1 gap-8">
                    <RegisterRequestForm mode="page" action={action1} state={state1} pending={pending1} />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center flex-1 gap-8">
                    <RegisterForm mode="page" action={action2} state={state2} pending={pending2}/>
                </div>
            )}
        </ModalWrapper>
    )
}
