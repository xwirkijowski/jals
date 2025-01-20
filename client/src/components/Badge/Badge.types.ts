import {SCompProps} from "@type/common";

export type TBadgeProps = {
	badgeType?: TBadgeType
	tooltip?: boolean
	ping?: boolean
} & SCompProps.THTMLButton<['type']> & SCompProps.TBase<true>

export enum EBadgeType {
	primary = 'primary',
	success = 'success',
	info = 'info',
	warning = 'warning',
	danger = 'danger',
	light = 'light',
	dark = 'dark',
	theme = 'theme',
	themeInverse = 'themeInverse',
}

export type TBadgeType = keyof typeof EBadgeType;