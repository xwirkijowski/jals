import {twMerge} from "tailwind-merge";
import cx from "classnames";

export {cx};

export function merge (...props: any): string {
	return twMerge(cx(props));
}