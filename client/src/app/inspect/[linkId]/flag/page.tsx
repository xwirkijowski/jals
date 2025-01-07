"use client"

import {useContext, useRef} from "react";
import {LinkContext} from "../../../../contexts/LinkContext";

// Components
import {FlagForm} from "../../../../actions/flag/Flag.form";

export default () => {
    const {data} = useContext(LinkContext);

    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <FlagForm link={data.link} mode="page" />
        </div>
    )
}