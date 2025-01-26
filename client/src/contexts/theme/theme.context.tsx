"use client";

import React, {createContext, useCallback, useEffect, useMemo, useState} from "react";
import {EThemes, TThemeContext} from "@ctx/theme/theme.types";

const themes: EThemes[] = [EThemes.dark, EThemes.light],
	  defaultTheme: EThemes = EThemes.dark,
	  storageKey = "theme",
	  defaultContext = { setTheme: () => {}, theme: defaultTheme };

const getTheme = (): EThemes => {
	let storageTheme: string|null = null;
	try {
		storageTheme = localStorage.getItem(storageKey);
	} catch (e) {} // Unsupported
	
	return validateTheme(storageTheme);
};

const validateTheme = (theme?: string|EThemes|null): EThemes => {
	if (theme && themes.includes(theme as EThemes)) return EThemes[theme];
	return defaultTheme;
}

export const ThemeContext = createContext<TThemeContext>(defaultContext)

export const ThemeProvider = (
	{children}: {children: React.ReactNode}
) => {
	const [theme, setThemeState] = useState<EThemes>(defaultTheme);
	
	// Load theme from storage on client
	useEffect(() => {
		setTheme(getTheme());
	})
	
	const setTheme = useCallback((newTheme: string) => {
		if (newTheme && themes.includes(newTheme as EThemes)) {
			setThemeState(EThemes[newTheme])
		}
	}, []);
	
	// Save theme in localstorage on theme change.
	useEffect(() => {
		try {
			localStorage.setItem(storageKey, theme);
		} catch (e) {} // Unsupported
	}, [theme])
 
	const providerValue = {
		theme,
		setTheme
	}
	
	return (
		<ThemeContext.Provider value={providerValue}>
			{children}
		</ThemeContext.Provider>
	)
}