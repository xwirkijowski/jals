import React from "react";
import {Property} from "csstype";

import TextAlign = Property.TextAlign;
import {SCompProps} from "@type/common";

export type TProps = {
	align?: TextAlign;
} & SCompProps.TBase<true>

export const typographyStyles: string[] = [
	'trans',
]