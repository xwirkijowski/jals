'use client'

import React, {useRef} from "react";
import cx from "classnames";
import {motion} from "motion/react";
import {redirect, RedirectType} from "next/navigation";

import {Button} from "@comp/Button";
import {Input} from "@comp/form/Input";

import {buttonStyles, formStyles, inputStyles} from "@act/shared/link/shared.link.styles";
import {HTMLMotionProps} from "framer-motion";

type TProps = {} & HTMLMotionProps<'div'>

export const InspectForm = ({...props}: TProps): React.ReactNode => {
    const inputRef = useRef<HTMLInputElement>(null);

    const submit = (e) => {
        e.preventDefault();
        redirect('inspect/'+inputRef?.current?.value, ('push' as RedirectType))
    }

    // @todo Add action to support resolving target to link

    return (
        <motion.div className={cx('flex w-full flex-col gap-8')} {...props}>
            <form onSubmit={(e) => submit(e)} className={cx(formStyles)}>
                <Input required type={"text"} ref={inputRef} className={inputStyles} placeholder="Input your URL code or paste the full link"/>
                <Button btnType={"darkPrimary"} type="submit" className={buttonStyles}>
                    Inspect
                </Button>
            </form>
        </motion.div>
    )
}