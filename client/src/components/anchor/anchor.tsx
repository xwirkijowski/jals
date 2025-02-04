"use client";

import React from "react";
import Link from "next/link";

import {merge} from "@lib/merge";

import {SCompProps} from "@type/common";

type TProps = {
	href: string
	bold?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLAnchor<["className"]>;

export function Anchor ({className, href, bold = false, children, ...props}: TProps): React.ReactNode {
	return (
		<Link href={href} className={merge(
			'text-orange-500 hover:text-orange-400 trans underline !underline-offset-2',
			{'font-bold': bold},
			className,
		)} {...props}>
			{children}
		</Link>
	)
}