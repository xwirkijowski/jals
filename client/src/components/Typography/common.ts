import React from "react";
import {Property} from "csstype";

import TextAlign = Property.TextAlign;

export type TProps = {
	align?: TextAlign;
	className?: string
	children: React.ReactNode;
}

export const typographyStyles: string[] = [
	'trans',
]