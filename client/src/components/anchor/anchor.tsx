"use client";

import React from "react";
import cx from "classnames";
import Link from "next/link";

import {SCompProps} from "@type/common";

type TProps = {
	href: string
	bold?: boolean
} & SCompProps.TBase<true> & SCompProps.THTMLAnchor<["className"]>;

export function Anchor ({className, href, bold = false, children, ...props}: TProps): React.ReactNode {
	return (
		<Link href={href} className={cx(
			'text-orange-500 hover:text-orange-400 trans underline !underline-offset-2',
			{'font-bold': bold},
			className,
		)} {...props}>
			{children}
		</Link>
	)
}