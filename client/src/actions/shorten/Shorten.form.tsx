'use client';

import cx from "classnames";
import {Fragment, useActionState} from "react";

// Components
import Link from "next/link";
import {Spinner} from "@comp/Spinner/Spinner";
import {Button} from "@comp/Button/Button";
import {Input} from "@comp/form/Input/Input";
import {CopyToClipboard} from "@act/shorten/CopyLinkToClipboard";

import {ShortenAction} from "./Shorten.action";
import {buttonStyles, formStyles, inputStyles} from "@act/shared/link/shared.link.styles";

export const ShortenForm = () => {
    const [state, action, pending] = useActionState(ShortenAction, null);

    return (
        <form action={action} className={cx(formStyles)}>
            {state?.result?.success ? (
                <Fragment>
                    <p className={cx(
                        'flex-1',
                        'bg-white',
                        'trans',
                        'text-zinc-600 text-md',
                        'outline-none block content-center',
                        'text-left',
                        'rounded-xl rounded-r-none',
                        'border border-transparent border-r-0 px-4 py-2 pr-7 -mr-3',
                        'placeholder:text-zinc-600/50',
                        'border-green-500')}>
                        {state.link.id}
                        <CopyToClipboard value={state.link.id} />
                    </p>
                    <Link href={'/' + state.link.id + '/+'} passHref>
                        <Button btnType={"success"} className={cx("flex-0")}>Inspect link</Button>
                    </Link>
                </Fragment>
            ) : (
                <Fragment>
                    <Input required type={"url"} name={"target"} disabled={pending} className={inputStyles} placeholder="Paste your link here" />
                    <Button btnType={"darkPrimary"} type="submit" disabled={pending} className={buttonStyles}>
                        {pending ? (<Spinner/>) : ("Shorten")}
                    </Button>
                </Fragment>
            )}
        </form>
    )
}