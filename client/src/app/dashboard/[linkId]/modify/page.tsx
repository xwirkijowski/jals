"use client"

import React from "react";

// Components
import {ModifyLinkForm} from "@act/@dashboard/modify/modify.form";
import {Container} from "@comp/container";

const Page = () => {
    return (
        <Container>
            <ModifyLinkForm mode="page"/>
        </Container>
    )
}

export default Page;