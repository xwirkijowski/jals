'use client';

import {useMutation} from "@apollo/client";
import {Fragment, use, useCallback, useRef, useState} from "react";

import cx from "classnames";

// Mutation
import {CREATE_LINK} from './Shorten.queries';

import {Spinner} from "@comp/Spinner/Spinner";
import Link from "next/link";

export const Shorten = () => {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef({});
    const [data, setData] = useState(null);

    const [mutate] = useMutation(CREATE_LINK);

    const handleSubmit = () => {
        setLoading(true);

        if (inputRef.current.value && inputRef.current.value !== '') {
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
                    inputRef.current.value = '';
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
                        </p>
                        <Link passHref
                            href={'/'+data.link.id+'/+'}
                            className={cx("bg-green-500 hover:bg-green-400 transition-all duration-150 text-white text-sm font-bold px-5 py-3 rounded-xl flex-0")}>
                            Inspect your link
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
                        <button
                            type="submit"
                            disabled={loading}
                            className={cx("bg-zinc-900 group-focus-within:bg-orange-500 group-focus-within:hover:bg-orange-400 hover:bg-zinc-700 transition-all duration-150 text-white text-sm font-bold px-5 py-3 rounded-xl flex-0",
                                'disabled:bg-orange-500')}>
                            {loading ? (<Spinner/>) : ("Shorten")}
                        </button>
                    </Fragment>
                )}
            </form>
        </div>
    )
}