'use client';

import {useMutation} from "@apollo/client";
import {Fragment, useRef, useState} from "react";

import cx from "classnames";

// Components
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";

// Mutation
import {CREATE_LINK} from './Shorten.queries';

import Link from "next/link";

type DataInterface = {
    link: {
        id: string,
        target: string,
    },
    result: {
        success: boolean,
        errors: Array<object>,
        errorCodes: Array<string>,
    }
}

export const Shorten = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataInterface|null>(null);

    const [mutate] = useMutation(CREATE_LINK);

    const handleSubmit = () => {
        setLoading(true);

        if (inputRef !== null && inputRef?.current?.value && inputRef.current.value !== '') {
            mutate({variables: {input: {target: inputRef.current.value}}}).then(res=>{
                console.log(res)
                if (res) setData(res.data.createLink);

                setLoading(false);
            });
        }

        setLoading(false);
    };

    return (
        <div className={cx('flex w-full flex-col gap-8')}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                    if (inputRef !== null && inputRef?.current?.value) inputRef.current.value = '';
                }}

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
                {data && data?.result?.success ? (
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
                            {data.link.id}
                            <a className={cx('float-end border-b border-b-current cursor-pointer text-orange-500 hover:text-orange-400 transition-all duration-150 text-sm font-bold')} onClick={e => {
                                navigator.clipboard.writeText(window.location.href + data.link.id)
                            }}>Copy link</a>
                        </p>
                        <Link href={'/' + data.link.id + '/+'} passHref>
                            <Button type={"success"} className={cx("flex-0")}>Inspect your link</Button>
                        </Link>
                    </Fragment>
                ) : (
                    <Fragment>
                        <input
                            required
                            type={"url"}
                            ref={inputRef}
                            disabled={loading}
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
                            type={"dark"}
                            buttonType="submit"
                            disabled={loading}
                            className={cx(
                                'flex-0',
                                'group-focus-within:bg-orange-500 group-focus-within:hover:bg-orange-400',
                                'disabled:bg-orange-500',
                                'hover:bg-zinc-700',
                            )}
                        >
                            {loading ? (<Spinner/>) : ("Shorten")}
                        </Button>
                    </Fragment>
                )}
            </form>
        </div>
    )
}