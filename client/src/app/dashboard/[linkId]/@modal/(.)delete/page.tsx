"use client";

import {useContext} from "react";

import {LinkContext} from "@ctx/link/link.context";

// Components

import {ModalWrapper} from '@comp/modal';

const Page = () => {
    const {link} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!link) {return null}

    return (
        <ModalWrapper>
            {}
        </ModalWrapper>
    )
}

export default Page;