"use client";

import React from "react";

import {ModalWrapper} from "@comp/Modal/Wrapper";
import {RegisterWrapper} from "@act/register/RegisterWrapper";

const Page = () => {
    return (
        <ModalWrapper>
            <RegisterWrapper mode={'modal'} />
        </ModalWrapper>
    )
}

export default Page;