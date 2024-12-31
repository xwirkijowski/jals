'use client';

import {useMutation} from "@apollo/client";
import {Fragment, use, useCallback, useContext, useRef, useState} from "react";

import cx from "classnames";

// Mutation
import {FLAG_LINK} from './Flag.queries';

import {Spinner} from "@comp/Spinner/Spinner";
import Link from "next/link";

type DataInterface = {
    result: {
        success: boolean,
        errors: Array<object>,
        errorCodes: Array<string>,
    }
}

export const Flag = ({link, mode}) => {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [data, setData] = useState<DataInterface|null>(null);

    const [mutate] = useMutation(FLAG_LINK);

    const handleSubmit = () => {
        setLoading(true);

        if (inputRef !== null && inputRef?.current?.value && inputRef.current.value !== '') {
            mutate({variables: {input: {linkId: link.id, note: inputRef.current.value}}}).then(res => {
                console.log(res)
                if (res) setData(res.data.flagLink);

                setLoading(false);
            });
        }

        setLoading(false);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                if (inputRef !== null && inputRef?.current?.value) inputRef.current.value = '';
            }}

            className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
            <div className={"p-8"}>
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                    Flag for moderation
                </h2>
                <p className={cx(
                    'flex flex-row gap-2 items-center rounded-full py-1 px-2 text-sm float-end text-nowrap',
                    'bg-zinc-100 text-zinc-500',
                )}>
                    <span className={cx(
                        'h-3 w-3 block rounded-full',
                        'before:content-[""] before:animate-ping before:h-3 before:w-3 before:block before:rounded-full',
                        'bg-zinc-500 before:bg-zinc-500',
                    )}/>
                    {link.id}
                </p>
            </div>
            <div
                className={cx(
                    'relative p-8 border-y border-zinc-900/15 grid grid-cols-2 w-full gap-4',
                )}>

                {data && data?.result?.success && ("Success")}

                <textarea
                    required
                    disabled={loading}
                    rows={4}
                    ref={inputRef}
                    className={cx(
                        'flex-1 resize-none',
                        'bg-white col-span-full',
                        'transition-all duration-150',
                        'text-zinc-600 text-md caret-orange-500',
                        'outline-none',
                        'rounded-xl',
                        'border border-zinc-900/15 px-4 py-2',
                        'placeholder:text-zinc-600/50',
                        'group-focus-within:border-orange-500',
                        'disabled:border-orange-500',
                    )} placeholder="Provide short reason for flag..."/>
            </div>
            <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                <Link href={`/inspect/${link.id}`}
                      className={cx(
                          "duration-150 transition-all",
                          "px-4 py-3",
                          "bg-zinc-100 text-zinc-900 block",
                          "text-base text-nowrap rounded-xl font-bold",
                          "hover:bg-zinc-200"
                      )}>Back to inspection</Link>
                <button
                    type={"submit"}
                    disabled={loading}
                    className={cx(
                        "duration-150 transition-all px-4 py-3 text-base bg-red-500 text-white block text-nowrap rounded-xl font-bold shadow-xl shadow-red-500/20",
                        "hover:scale-[0.975] hover:bg-red-400 hover:shadow-md",
                        "disabled:hover:scale-100 disabled:bg-red-300 disabled:shadow-md")}>
                    {loading ? (<Spinner />) : ("Send flag")}
                </button>
            </div>
        </form>
    )
}