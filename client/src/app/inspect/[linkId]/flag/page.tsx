"use client"

import {useContext} from "react";
import {LinkContext} from "@ctx/link/link.context";

// Components
import {FlagForm} from "@act/flag/Flag.form";

const Page = () => {
    const {data} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!data?.link) {
        return null
    }

    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <FlagForm link={data.link} mode="page"/>
        </div>
    )
}

export default Page;