"use client";

import React, {createContext, useState} from "react";

export namespace SThemeContext {
	export enum EThemes {
		light = "light",
		dark = "dark",
	}

	export type TThemeContext = {
		theme: EThemes;
		handleTheme: Function;
	}
}

const defaultTheme = SThemeContext.EThemes["dark"];

export const ThemeContext = createContext<SThemeContext.TThemeContext>({
	theme: defaultTheme,
	handleTheme: () => {}
})

// @todo Fix default value, loading after refresh

export const ThemeContextWrapper = (
	{children}: {children: React.ReactNode}
) => {
	let localTheme: SThemeContext.EThemes = defaultTheme;

	if (typeof window !== "undefined") {
		const lsValue: string | null = localStorage.getItem("theme");

		if (lsValue && ['light', 'dark'].includes(lsValue)) {
			localTheme = SThemeContext.EThemes[lsValue];
		}
	}

	const [theme, setTheme] = useState<SThemeContext.EThemes>(localTheme||defaultTheme);

	const handleTheme = () => {
		const nextTheme = (theme === SThemeContext.EThemes.dark) ? SThemeContext.EThemes.light : SThemeContext.EThemes.dark

		localStorage.setItem("theme", nextTheme);
		setTheme(nextTheme);
	}

	const value = {theme, handleTheme}

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	)
}