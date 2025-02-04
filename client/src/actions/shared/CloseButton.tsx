"use client";

import React from "react";
import {useRouter} from "next/navigation";

import Link from "next/link";
import {Button} from "@comp/button";
import {SCompProps} from "@type/common";
import {MotionProps} from "motion/react";

type TProps = {
	mode: 'page' | 'modal'
	href?: string;
	route?: string;
	label?: string;
} & SCompProps.THTMLButton<['className']> & SCompProps.TBase<true> & MotionProps

export const CloseButton = (
	{mode, href, route, label, ...props}: TProps
): React.ReactNode => {
	const router = useRouter();

	if (mode === 'page') {
		if (href) {
			return(<Link passHref href={href}><Button btnType={'theme'}>{label ? label : 'Close'}</Button></Link>)
		} else {
			return(<Button btnType={'theme'} onClick={() => router.push(route ? route : '/')}>{label ? label : 'Close'}</Button>)
		}
	} else {
		return (<Button btnType={'theme'} onClick={()=> route ? router.push(route) : router.back()}>Close</Button>);
	}
}