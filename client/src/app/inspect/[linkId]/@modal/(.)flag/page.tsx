"use client";

import {useContext} from "react";

import {LinkContext} from "@ctx/link/link.context";

// Components
import {FlagForm} from "@act/flag/Flag.form";
import {ModalWrapper} from '@comp/modal';

const Page = () => {
    const {data} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!data?.link) {return null}

    return (
        <ModalWrapper>
            <FlagForm link={data.link} mode="modal" />
        </ModalWrapper>
    )
}

export default Page;