import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

export type TBadgeProps = {
	badgeType?: keyof typeof EBadgeType
	tooltip?: boolean
	ping?: boolean
} & SCompProps.THTMLButton<['type']> & SCompProps.TBase<true> & MotionProps

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