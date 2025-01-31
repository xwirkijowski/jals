import {EBadgeType} from "@comp/badge/badge.types";

const styles: Record<keyof typeof EBadgeType, Array<string>|string> = {
	primary: [
		'bg-orange-100 text-orange-500 border-orange-200',
		'dark:bg-orange-950 dark:text-orange-500 dark:border-orange-500',
	],
	success: [
		'bg-green-100 text-green-500 border-green-200',
		'dark:bg-green-900 dark:text-green-500 dark:border-green-500',
	],
	info: [
		'bg-blue-100 text-blue-500 border-blue-200',
		'dark:bg-blue-900 dark:text-blue-500 dark:border-blue-500',
	],
	warning: [
		'bg-orange-100 text-orange-500 border-orange-200',
		'dark:bg-orange-950 dark:text-orange-500 dark:border-orange-500',
	],
	danger: [
		'bg-red-100 text-red-500 border-red-200',
		'dark:bg-red-950 dark:text-red-500 dark:border-red-500',
	],
	light: [
		'bg-zinc-100 text-zinc-500 border-zinc-200',
		'dark:bg-zinc-100 dark:text-zinc-500 dark:border-zinc-500',
	],
	dark: [
		'bg-zinc-900 text-zinc-100 border-zinc-800',
		'dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
	],
	theme: [],
	themeInverse: [],
}

styles.theme = [styles.light[0], styles.dark[1]];
styles.themeInverse = [styles.dark[0], styles.light[1]];

export {styles};