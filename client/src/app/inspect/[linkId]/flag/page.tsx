"use client"

import {useContext, useRef} from "react";
import {LinkContext} from "../context";

// Components
import {Flag} from "@comp/logic/Flag/Flag";

export default () => {
    const {data} = useContext(LinkContext);

    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <Flag link={data.link} mode="page" />
        </div>
    )
}