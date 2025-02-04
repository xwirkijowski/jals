"use client";

// Components
import {ModalWrapper} from '@comp/modal';
import {DeleteLinkForm} from "@act/@dashboard/delete/delete.form";

export default function Page () {
    return <ModalWrapper><DeleteLinkForm mode="modal" /></ModalWrapper>
}