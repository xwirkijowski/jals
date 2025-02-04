"use client";

import React from "react";

import {merge, cx} from "@lib/merge";

import {TCurrentUser} from "@ctx/auth/auth.types";

export const UserBadge = ({user}: {user: TCurrentUser}): React.ReactNode => {
	if (!user) return null;

	return (
		<p className={merge(
			'flex flex-row items-center rounded-full py-2 px-4 text-sm float-end text-nowrap gap-2',
			'bg-zinc-100 text-zinc-500',
			'dark:bg-gray-800 dark:text-gray-200/50',
			'c-trans-4'
		)}>
			{user?.isAdmin && <span className={cx('block uppercase text-xs font-bold')}>Admin</span>}

			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
			     className="bi bi-person-circle" viewBox="0 0 16 16">
				<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
				<path fillRule="evenodd"
				      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
			</svg>

			{user?.email}
		</p>
	)
}