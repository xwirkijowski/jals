"use client";

import cx from "classnames";
import Link from "next/link";

import {useContext} from "react";
import {AuthContext} from "@ctx/auth/auth.context";

import {Button} from "@comp/button";
import {LogOutButton} from "@act/@auth/logout/LogOut.button";
import {UserBadge} from "@comp/Layout/header/user-badge";
import {Tagline} from "@comp/Layout/header/tagline";

export const Header = () => {
    const {session, user} = useContext(AuthContext);

    return (
        <header className={cx(
            'flex flex-row w-full px-8 py-4 gap-8 mb-8 bg-white border-b-2 border-orange-500',
            'dark:bg-gray-900',
            'c-trans-4',
        )}>
            <Tagline />
            <nav className="flex flex-row flex-1 gap-4 justify-end items-center">
                {session && user ? (
                    <>
                        <UserBadge user={user} />
                        <Link href={'/dashboard'} passHref><Button btnType={'primary'}>Dashboard</Button></Link>
                        <LogOutButton />
                    </>
                ) : (
                    <>
                        <Link href={'/login'} passHref><Button btnType={'theme'}>Log In</Button></Link>
                        <Link href={'/register'} passHref><Button>Create account</Button></Link>
                    </>
                )}
            </nav>
        </header>
    )
}