import {SCompProps} from "@type/common";

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

export type TButtonProps = {
	btnType?: TButtonType
	effects?: boolean
	type?: SCompProps.THTMLButton['type']
} & SCompProps.THTMLButton<['className']> & SCompProps.TBase<true>