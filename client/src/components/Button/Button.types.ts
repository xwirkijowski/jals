import React from "react";

export enum EButtonType {
	primary = 'primary',
	success = 'success',
	info = 'info',
	warning = 'warning',
	danger = 'danger',
	light = 'light',
	dark = 'dark',
	theme = 'theme',
	themeInverse = 'theme',
	darkPrimary = 'darkPrimary',
}

export type TButtonType = keyof typeof EButtonType;

export type THTMLButton = React.ButtonHTMLAttributes<HTMLButtonElement>

export type TButtonProps = {
	btnType?: TButtonType
	effects?: boolean
	type?: THTMLButton['type']
	className?: string
	children?: React.ReactNode
} & THTMLButton