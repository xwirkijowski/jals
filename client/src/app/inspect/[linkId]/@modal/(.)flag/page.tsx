"use client";

import {useContext} from "react";

import {LinkContext} from "app/inspect/[linkId]/context";

// Components
import {Flag} from "@comp/logic/Flag/Flag";
import {ModalWrapper} from '@comp/Modal/Wrapper';

export default () => {
    const {data} = useContext(LinkContext);

    return (
        <ModalWrapper>
            <Flag link={data.link} mode="modal" />
        </ModalWrapper>
    )
}