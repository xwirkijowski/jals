"use client"

import {useContext} from "react";
import {AuthContext, TContextSession} from "../../contexts/auth/auth.context";

import Link from "next/link";
import Button from "@comp/Button/Button";
import {isSessionValid} from "../../contexts/auth/auth.utils.client";

export const Header = async () => {
    const auth = useContext(AuthContext);
    const authValid: boolean = isSessionValid(auth);

    return (
        <header className="flex flex-row w-full px-8 py-4 gap-8 mb-8 bg-white border-b-2 border-orange-500">
            <div className="flex flex-row flex-0 items-center gap-4 text-zinc-600">
                <h1 className="text-xl font-bold text-zinc-900"><Link href={'/'}>JALS
                    <span className="text-orange-500">v2</span></Link></h1>
                <p className="pointer-events-none hidden sm:block">Just Another Link Shortener</p>
            </div>
            <nav className="flex flex-row flex-1 gap-4 justify-end">
                {authValid ? (
                    <>
                        <p>{(auth as TContextSession).user.email}</p>
                        <Link href="/logout" passHref><Button btnType={'light'}>Log Out</Button></Link>
                    </>
                ) : (
                    <>
                        <Link href={'/login'} passHref><Button btnType={'light'}>Log In</Button></Link>
                        <Link href={'/register'} passHref><Button>Create account</Button></Link>
                    </>
                )}
            </nav>
        </header>
    )
}