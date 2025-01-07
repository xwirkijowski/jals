"use client";

import {useContext} from "react";

import {LinkContext} from "../../../../../contexts/LinkContext";

// Components
import {FlagForm} from "../../../../../actions/flag/Flag.form";
import {ModalWrapper} from '@comp/Modal/Wrapper';

export default () => {
    const {data} = useContext(LinkContext);

    return (
        <ModalWrapper>
            <FlagForm link={data.link} mode="modal" />
        </ModalWrapper>
    )
}