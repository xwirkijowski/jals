export enum EThemes {
	light = "light",
	dark = "dark",
}

export type TThemeContext = {
	theme?: EThemes;
	setTheme: Function;
}