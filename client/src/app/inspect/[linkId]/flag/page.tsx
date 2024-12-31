"use client"

import Link from "next/link";

// Components
import cx from "classnames";
import {Tooltip} from "@comp/Tooltip/Tooltip";

import {useContext, useRef} from "react";
import {LinkContext} from "../context";
import {Flag} from "@comp/logic/Flag/Flag";

const Page = async () => {
    const {data} = useContext(LinkContext);

    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
            <Flag link={data.link} mode="page" />
        </div>
    )
}

export default Page;