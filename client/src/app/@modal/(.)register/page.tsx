"use client";

import React from "react";

import {ModalWrapper} from "@comp/Modal/Wrapper";
import {RegisterWrapper} from "@act/register/RegisterWrapper";

export default () => {
    return (
        <ModalWrapper>
            <RegisterWrapper mode={'modal'} />
        </ModalWrapper>
    )
}
