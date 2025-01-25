import {ECalloutType} from "@comp/Callout/Callout.types";

// @todo Support dark mode
export const styles: Record<keyof typeof ECalloutType, string> = {
	primary: 'text-white bg-orange-500  shadow-orange-500/20',
	success: 'text-white bg-green-500  shadow-green-500/20',
	info: 'text-white bg-blue-500  shadow-blue-500/20',
	warning: 'text-white bg-orange-500  shadow-orange-500/20',
	danger: 'text-white bg-red-500  shadow-red-500/20',
	light: 'text-zinc-600 bg-zinc-300  shadow-zinc-900/20',
	dark: 'text-white bg-zinc-900  shadow-zinc-900/20',
}