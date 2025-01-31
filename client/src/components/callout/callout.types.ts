import React from "react";
import {SCompProps} from "@type/common";

export enum ECalloutType {
	primary = 'primary',
	success = 'success',
	info = 'info',
	warning = 'warning',
	danger = 'danger',
	light = 'light',
	dark = 'dark',
}

export type TCalloutProps = {
	title?: string,
	type?: keyof typeof ECalloutType,
} & React.HTMLAttributes<HTMLDivElement> & SCompProps.TBase<true>