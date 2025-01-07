'use client';

import cx from "classnames";
import {Fragment, useActionState} from "react";

// Components
import Link from "next/link";
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";

import {ShortenAction} from "./Shorten.action";

export const ShortenForm = () => {
    const [state, action, pending] = useActionState(ShortenAction, null);

    return (
        <div className={cx('flex w-full flex-col gap-8')}>
            <form action={action}
                className={cx(
                    'flex group',
                    'w-full',
                    'rounded-xl',
                    'transition-all',
                    'duration-150',
                    'shadow-md',
                    'relative',
                    'shadow-zinc-900/20',
                    'focus-within:shadow-lg hover:shadow-lg',
                )}>
                {state?.result?.success ? (
                    <Fragment>
                        <p className={cx(
                            'flex-1',
                            'bg-white',
                            'transition-all duration-150',
                            'text-zinc-600 text-md',
                            'outline-none block content-center',
                            'text-left',
                            'rounded-xl rounded-r-none',
                            'border border-transparent border-r-0 px-4 py-2 pr-7 -mr-3',
                            'placeholder:text-zinc-600/50',
                            'border-green-500')}>
                            {state.link.id}
                            <a className={cx('float-end border-b border-b-current cursor-pointer text-orange-500 hover:text-orange-400 transition-all duration-150 text-sm font-bold')} onClick={e => {
                                navigator.clipboard.writeText(window.location.href + state.link.id)
                            }}>Copy link</a>
                        </p>
                        <Link href={'/' + state.link.id + '/+'} passHref>
                            <Button btnType={"success"} className={cx("flex-0")}>Inspect your link</Button>
                        </Link>
                    </Fragment>
                ) : (
                    <Fragment>
                        <input
                            required
                            type={"url"}
                            name={"target"}
                            disabled={pending}
                            className={cx(
                                'flex-1',
                                'bg-white',
                                'transition-all duration-150',
                                'text-zinc-600 text-md caret-orange-500',
                                'outline-none',
                                'rounded-xl rounded-r-none',
                                'border border-transparent border-r-0 px-4 py-2 pr-7 -mr-3',
                                'placeholder:text-zinc-600/50',
                                'group-focus-within:border-orange-500',
                                'disabled:border-orange-500',
                            )} placeholder="Paste your link here"/>
                        <Button
                            btnType={"dark"}
                            type="submit"
                            disabled={pending}
                            className={cx(
                                'flex-0',
                                'group-focus-within:bg-orange-500 group-focus-within:hover:bg-orange-400',
                                'disabled:bg-orange-500',
                                'hover:bg-zinc-700',
                            )}
                        >
                            {pending ? (<Spinner/>) : ("Shorten")}
                        </Button>
                    </Fragment>
                )}
            </form>
        </div>
    )
}