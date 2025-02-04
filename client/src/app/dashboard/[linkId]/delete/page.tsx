"use client"

import React, {useContext, useEffect} from "react";
import {LinkContext} from "@ctx/link/link.context";
import {NotificationContext} from "@ctx/notification/notification.context";

// Components
import {DeleteLinkForm} from "@act/@dashboard/delete/delete.form";
import {Container} from "@comp/container";
import {useRouter} from "next/navigation";
import {LinkNotFound} from "@comp/@organisms/link-not-found";

const Page = () => {
    const {link} = useContext(LinkContext);
    
    // @todo Handle broken context edge case

    return (
        <Container>
            {link ? (
                <DeleteLinkForm mode="page"/>
            ) : (
                <LinkNotFound context={'dashboard'} />
            )}
        </Container>
    )
}

export default Page;