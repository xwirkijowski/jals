"use client";

import {useContext} from "react";

import {LinkContext} from "@ctx/link/link.context";

// Components
import {FlagForm} from "@act/@link/flag/Flag.form";
import {ModalWrapper} from '@comp/modal';

const Page = () => {
    const {link} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!link) {return null}

    return (
        <ModalWrapper>
            <FlagForm link={link} mode="modal" />
        </ModalWrapper>
    )
}

export default Page;