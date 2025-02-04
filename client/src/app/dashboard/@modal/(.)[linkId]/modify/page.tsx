"use client";

// Components
import {ModalWrapper} from '@comp/modal';
import {ModifyLinkForm} from "@act/@dashboard/modify/modify.form";

export default function Page () {
    return <ModalWrapper><ModifyLinkForm mode="modal" /></ModalWrapper>
}