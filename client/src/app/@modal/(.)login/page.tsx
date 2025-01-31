"use client";

import React from "react";

import {ModalWrapper} from "@comp/modal/modal-wrapper";
import {LogInWrapper} from "@act/login/LogInWrapper";

const Page = () => {
    return (
        <ModalWrapper>
            <LogInWrapper mode={'modal'} />
        </ModalWrapper>
    )
}

export default Page;