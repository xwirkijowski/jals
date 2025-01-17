"use client";

import React, {createContext, useCallback, useEffect, useState} from "react";

export namespace SThemeContext {
	export enum EThemes {
		light = "light",
		dark = "dark",
	}

	export type TThemeContext = {
		theme: EThemes;
		setTheme: Function;
	}
}

const defaultTheme = SThemeContext.EThemes["dark"];

export const ThemeContext = createContext<SThemeContext.TThemeContext>({
	theme: defaultTheme,
	setTheme: () => {}
})

export const ThemeContextWrapper = (
	{children}: {children: React.ReactNode}
) => {
	let localTheme;

	if (typeof window !== "undefined") {
		const lsValue: string | null = localStorage.getItem("theme");

		if (lsValue && ['light', 'dark'].includes(lsValue)) {
			localTheme = SThemeContext.EThemes[lsValue];
		} else {
			localTheme = defaultTheme;
		}
	}

	const [theme, setTheme] = useState<SThemeContext.EThemes>(localTheme||defaultTheme);
	const value = {theme, setTheme}

	useEffect(() => {
		localStorage.setItem("theme", SThemeContext.EThemes[theme]);
	}, [theme])

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	)
}