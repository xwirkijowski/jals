"use client";

import React from "react";
import Link from "next/link";

export const Tagline = () => {
	return (
		<div className="flex flex-row flex-0 items-center gap-4">
			<h1 className={`text-xl font-bold text-zinc-900 dark:text-gray-200 c-trans-4`}><Link href={'/client/public'}>JALS
				<span className="text-orange-500">v2</span></Link></h1>
			<p className={`pointer-events-none hidden text-zinc-600 dark:text-gray-200/50 sm:block c-trans-4`}>Just Another Link Shortener</p>
		</div>
	)
}