"use client";

import React, {useActionState} from "react";
import {LogInRequestForm} from "actions/login/stage1/LogInRequest.form";
import {LogInRequestAction} from "actions/login/stage1/LogInRequest.action";
import {LogInForm} from "actions/login/stage2/LogIn.form";
import {LogInAction} from "actions/login/stage2/LogIn.action";

export default () => {
    const [state1, action1, pending1] = useActionState(LogInRequestAction, undefined);
    const [state2, action2, pending2] = useActionState(LogInAction.bind(null, {email: state1?.email}), undefined);

    return (
        <>
            {(!state1 || state1.result.success === false) ? (
                <div className="flex flex-col justify-center items-center flex-1">
                    <LogInRequestForm mode="page" action={action1} state={state1} pending={pending1} />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center flex-1">
                    <LogInForm mode="page" action={action2} state={state2} pending={pending2}/>
                </div>
            )}
        </>
    )
}
