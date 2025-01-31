import {EPingType} from "@comp/ping/ping.types";

const styles: Record<keyof typeof EPingType, Array<string>|string> = {
	primary: 'bg-orange-500 before:bg-orange-500',
	success: 'bg-green-500 before:bg-green-500',
	info: 'bg-blue-500 before:bg-blue-500',
	warning: 'bg-red-500 before:bg-red-500',
	danger: 'bg-red-500 before:bg-red-500',
	light: [
		'bg-zinc-500 before:bg-zinc-500',
		'dark:bg-zinc-500 dark:before:bg-zinc-500',
	],
	dark: [
		'bg-zinc-100 before:bg-zinc-100',
		'dark:bg-zinc-400 dark:before:bg-zinc-400',
	],
	theme: '',
	themeInverse: '',
}

styles.theme = [styles.light[0], styles.dark[1]];
styles.themeInverse = [styles.dark[0], styles.light[1]];

export {styles}