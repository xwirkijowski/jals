import {ENotificationType} from "@comp/notification/notification.types";

// @todo Support dark mode
export const styles: Record<keyof typeof ENotificationType, string> = {
	primary: 'text-white bg-orange-600 shadow-orange-600/20',
	success: 'text-white bg-green-600 shadow-green-600/20',
	info: 'text-white bg-blue-600 shadow-blue-600/20',
	warning: 'text-white bg-orange-600 shadow-orange-600/20',
	danger: 'text-white bg-red-600 shadow-red-600/20',
	light: 'text-zinc-600 bg-zinc-300 shadow-zinc-900/20',
	dark: 'text-white bg-zinc-900 shadow-zinc-900/20',
}