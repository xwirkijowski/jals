"use client";

import React from "react";

import {ModalWrapper} from "@comp/modal/modal-wrapper";
import {RegisterWrapper} from "@act/@auth/register/RegisterWrapper";

const Page = () => <ModalWrapper><RegisterWrapper mode={'modal'} /></ModalWrapper>

export default Page;