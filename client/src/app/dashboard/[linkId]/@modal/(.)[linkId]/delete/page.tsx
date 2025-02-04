"use client";

import {useContext} from "react";

import {LinkContext} from "@ctx/link/link.context";

// Components
import {ModalWrapper} from '@comp/modal';
import {DeleteLinkForm} from "@act/@dashboard/delete/delete.form";

const Page = () => {
    const {link} = useContext(LinkContext);

    // @todo Handle broken context edge case

    if (!link) {return null}

    return (
        <ModalWrapper>
            <DeleteLinkForm link={link} mode="modal" />
        </ModalWrapper>
    )
}

export default Page;