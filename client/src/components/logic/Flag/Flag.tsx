'use client';

import {useMutation} from "@apollo/client";
import {useState, FormEvent} from "react";
import {useRouter} from 'next/navigation';
import cx from "classnames";

// Mutation
import {FLAG_LINK} from './Flag.queries';

// Components
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";
import Callout from "@comp/Callout/Callout";
import Link from "next/link";

// Types
import {MutationDataType} from '@type/data/MutationData';
import {LinkType} from "@type/data/Link";

export const Flag = ({
    link,
    mode = 'page',
 }: {
    link: LinkType,
    mode: 'page'|'modal'

}) => {
    const router = useRouter();

    const [input, setInput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<MutationDataType|null>(null);

    const [mutate] = useMutation(FLAG_LINK);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);

        // Validation

        if (input !== null && input !== '') {
            mutate({
                variables: {
                    input: {
                        linkId: link.id,
                        note: input,
                    }
                }
            })
                .then(res =>{
                    // @todo Validate response, check for errors
                    setData(res.data.flagLink);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                    setInput('');
                });
        }
    };

    let isSuccess = (data && data?.result?.success);

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}

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
            {isSuccess ? (
                <div
                    className={cx(
                        'relative p-8 border-y border-zinc-900/15 w-full',
                    )}
                >
                    <Callout type="success">
                        <p>Flag report has been received!</p>
                    </Callout>
                </div>
            ) : (
                <div
                    className={cx(
                        'relative p-8 border-y border-zinc-900/15 grid grid-cols-2 w-full gap-4',
                    )}
                >
                    <textarea
                        required
                        disabled={loading}
                        rows={4}
                        onChange={(e) => setInput(e.target.value)}
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
            )}
            {isSuccess ? (
                <div className={"col-span-full flex gap-8 p-8 justify-end items-center"}>
                    {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button type={'light'}>Back to inspection</Button></Link>)}
                    {mode === 'modal' && (<Button type={'light'} onClick={()=>router.back()}>Close</Button>)}
                </div>
            ) : (
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    {mode === 'page' && (<Link href={`/inspect/${link.id}`} passHref><Button type={'light'}>Back to inspection</Button></Link>)}
                    {mode === 'modal' && (<Button type={'light'} onClick={()=>router.back()}>Close</Button>)}

                    <Button type={"danger"} buttonType={'submit'} disabled={loading} effects={true}>
                        {loading ? (<Spinner/>) : ("Send flag")}
                    </Button>
                </div>
                )
            }
        </form>
    )
}