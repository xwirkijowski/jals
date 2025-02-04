"use client"

import {useContext} from "react";
import {LinkContext} from "@ctx/link/link.context";

// Components
import {FlagForm} from "@act/@link/flag/Flag.form";
import {Container} from "@comp/container";

const Page = () => {
    const {link} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!link) {
        return null
    }

    return (
        <Container>
            <FlagForm link={link} mode="page"/>
        </Container>
    )
}

export default Page;