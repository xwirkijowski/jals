"use client";

import React from "react";

import {ModalWrapper} from "@comp/Modal/Wrapper";
import {LogInWrapper} from "@act/login/LogInWrapper";

export default () => {
    return (
        <ModalWrapper>
            <LogInWrapper mode={'modal'} />
        </ModalWrapper>
    )
}
