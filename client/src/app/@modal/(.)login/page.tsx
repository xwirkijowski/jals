"use client";

import React from "react";

import {ModalWrapper} from "@comp/modal/modal-wrapper";
import {LogInWrapper} from "@act/@auth/login/LogInWrapper";

const Page = () => <ModalWrapper><LogInWrapper mode={'modal'} /></ModalWrapper>

export default Page;