'use client';

import {useRouter} from 'next/navigation';
import cx from "classnames";

// Components
import Link from "next/link";
import {setupErrorCallouts} from "../../shared/mutation.utilities";
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";
import {Input} from "@comp/Form/Input";
import Callout from "@comp/Callout/Callout";

const list = cx(
    'text-zinc-600 text-md',
    'pl-6 relative',
    'before:content-[""] before:w-4 before:top-2.5 before:absolute before:h-[1px] before:bg-current before:left-0')

export const RegisterRequestForm = ({
    action,
    state,
    pending,
}: {
    action: any
    state: any,
    pending: boolean,
}) => {
    const router = useRouter();
    const errorCallouts = setupErrorCallouts(state);

    return (
        <form action={action} className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
            <div className={"p-8 flex flex-col gap-4"}>
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                    Create an account
                </h2>
                <ul>
                    <li className={list}>Gain access to detailed statistics</li>
                    <li className={list}>Access user agent breakdown</li>
                    <li className={list}>See new clicks as they happen</li>
                    <li className={list}>Edit your links</li>
                </ul>
                <p className={cx('text-zinc-600 text-md')}>
                    You will receive an authentication code to confirm your email address.
                </p>
                <p className={cx('text-zinc-600 text-md')}>You will be able to input the code on the next step. Alternatively you can use the magic link from the email.</p>
                {errorCallouts}
            </div>
            {state?.result?.success ? (
                <div
                    className={cx(
                        'relative p-8 border-y border-zinc-900/15 w-full',
                    )}
                >
                    <Callout type="success">
                        <p>Authentication code has been send!</p>
                    </Callout>
                </div>
            ) : (
                <div className={cx('relative p-8 border-y border-zinc-900/15 flex flex-col w-full gap-4')}>
                    <Input autoFocus name={'email'} type={'email'} withLabel={'E-mail address'} id={'register-email'} disabled={pending} required/>
                </div>
            )}
            <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                <Button btnType={'light'} type={'button'} onClick={()=>router.back()}>Close</Button>
                <div className={'flex gap-4'}>
                    <Link href={'/login'} passHref replace>
                        <Button btnType={'light'} type={'button'} disabled={pending} effects={false}>Log In</Button>
                    </Link>
                    <Button btnType={"primary"} type={'submit'} disabled={pending} effects={true}>
                        {pending ? (<Spinner/>) : ("Request code")}
                    </Button>
                </div>
            </div>
        </form>
    )
}