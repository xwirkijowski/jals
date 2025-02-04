"use client"

import React from "react";

// Components
import {DeleteLinkForm} from "@act/@dashboard/delete/delete.form";
import {Container} from "@comp/container";

const Page = () => {
    return (
        <Container>
            <DeleteLinkForm mode="page"/>
        </Container>
    )
}

export default Page;