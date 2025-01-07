'use client';

import {useRouter} from 'next/navigation';
import cx from "classnames";

// Components
import Link from "next/link";
import {Spinner} from "@comp/Spinner/Spinner";
import Button from "@comp/Button/Button";
import {Input} from "@comp/Form/Input";
import Callout from "@comp/Callout/Callout";

export const LogInRequestForm = ({
    mode = 'page',
    action,
    state,
    pending,
}: {
    mode: 'page'|'modal'
    action: any
    state: any,
    pending: boolean,
}) => {
    const router = useRouter();

    return (
        <form action={action} className="w-full max-w-xl flex flex-col bg-white shadow-xl rounded-xl">
            <div className={"p-8 flex flex-col gap-4"}>
                <h2 className="font-bold text-zinc-900 text-2xl/tight sm:text-2xl/tight float-start">
                    Log in
                </h2>
                <p className={cx('text-zinc-600 text-md')}>
                    If you have an account, you will receive an authentication code needed to log in to your account.
                </p>
                <p className={cx('text-zinc-600 text-md')}>You will be able to input the code on the next step. Alternatively you can use the magic link from the email.</p>
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
                    <Input autoFocus name={'email'} type={'email'} withLabel={'E-mail address'} id={'login-email'} disabled={pending} required/>
                </div>
            )}
            {state?.result?.success ? (
                <div className={"col-span-full flex gap-8 p-8 justify-end items-center"}>
                    <Link href={'/login/code'} passHref>
                        <Button btnType={"success"} effects={true}>
                            Continue
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className={"col-span-full flex gap-8 p-8 justify-between items-center"}>
                    <Button btnType={'light'} type={'button'} onClick={()=>router.back()}>Close</Button>
                    <div className={'flex gap-4'}>
                        <Link href={'/register'} passHref>
                            <Button btnType={'light'} type={'button'} disabled={pending} effects={false}>Register</Button>
                        </Link>
                        <Button btnType={"primary"} type={'submit'} disabled={pending} effects={true}>
                            {pending ? (<Spinner/>) : ("Request code")}
                        </Button>
                    </div>
                </div>
            )}
        </form>
    )
}