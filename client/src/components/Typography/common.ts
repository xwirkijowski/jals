import {Property} from "csstype";
import TextAlign = Property.TextAlign;

import {SCompProps} from "@type/common";
import {MotionProps} from "framer-motion";

export type TProps = {
	align?: TextAlign;
} & SCompProps.TBase<true> & MotionProps

export const styles: string[] = [
	'trans',
]