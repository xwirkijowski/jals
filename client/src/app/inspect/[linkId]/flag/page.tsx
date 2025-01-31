"use client"

import {useContext} from "react";
import {LinkContext} from "@ctx/link/link.context";

// Components
import {FlagForm} from "@act/flag/Flag.form";
import {Container} from "@comp/container";

const Page = () => {
    const {data} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!data?.link) {
        return null
    }

    return (
        <Container>
            <FlagForm link={data.link} mode="page"/>
        </Container>
    )
}

export default Page;