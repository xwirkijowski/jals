"use client";

import React, {useCallback, useEffect, useState} from "react";
import cx from "classnames";

export const CopyToClipboard = (
	{value}: {value: string}
): React.ReactNode => {
	const [mounted, setMounted] = useState<boolean>(false)
	const [supportsClipboard, setSupportsClipboard] = useState<boolean>(false)

	useEffect(() => {
		setMounted(true)
		if (window?.navigator?.clipboard && window?.isSecureContext) {
			setSupportsClipboard(true)
		}
	}, [])

	const copyLink = useCallback(() => {
		if (mounted && supportsClipboard) window.navigator.clipboard.writeText(window.location.href + value)
	}, [mounted, supportsClipboard, value])

	if (!mounted || !supportsClipboard) return null;

	return (
		<a className={cx('float-end border-b border-b-current cursor-pointer text-orange-500 hover:text-orange-400 trans text-sm font-bold')} onClick={copyLink}>
			Copy link
		</a>
	);
}