'use client'

import cx from "classnames";

import {useRef} from "react";
import {redirect, RedirectType} from "next/navigation";

import Button from "@comp/Button/Button";
import {Input} from "@comp/Form/Input";

export const InspectForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={cx('flex w-full flex-col gap-8')}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    redirect('inspect/'+inputRef?.current?.value, ('push' as RedirectType))
                }}

                className={cx(
                    'flex group',
                    'w-full',
                    'rounded-xl',
                    'trans',
                    'shadow-md',
                    'relative',
                    'shadow-zinc-900/20',
                    'focus-within:shadow-lg hover:shadow-lg',
                )}>

                <Input
                    required
                    type={"text"}
                    ref={inputRef}
                    className={cx(
                        'rounded-r-none',
                        '!border-transparent border-r-0 !py-2 !pr-7 !-mr-3',
                        'group-focus-within:!border-orange-500',
                    )} placeholder="Input your URL code or paste the full link"/>
                <Button
                    btnType={"darkPrimary"}
                    type="submit"
                    className={cx(
                        'flex-0',
                        'group-focus-within:bg-orange-500 group-focus-within:hover:bg-orange-400',
                        'disabled:bg-orange-500',
                    )}
                >
                    Inspect
                </Button>
            </form>
        </div>
    )
}