'use client'

import cx from "classnames";

import {useRef} from "react";
import {redirect, RedirectType} from "next/navigation";

import {Button} from "@comp/Button/Button";
import {Input} from "@comp/form/Input/Input";
import {buttonStyles, formStyles, inputStyles} from "@act/shared/link/shared.link.styles";

export const InspectForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const submit = (e) => {
        e.preventDefault();
        redirect('inspect/'+inputRef?.current?.value, ('push' as RedirectType))
    }

    // @todo Add action to support resolving target to link

    return (
        <div className={cx('flex w-full flex-col gap-8')}>
            <form onSubmit={(e) => submit(e)} className={cx(formStyles)}>
                <Input required type={"text"} ref={inputRef} className={inputStyles} placeholder="Input your URL code or paste the full link"/>
                <Button btnType={"darkPrimary"} type="submit" className={buttonStyles}>
                    Inspect
                </Button>
            </form>
        </div>
    )
}