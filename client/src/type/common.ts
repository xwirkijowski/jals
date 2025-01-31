import React from "react";

export namespace SCompProps {
	/**
	 * Universal base for all components
	 */
	export type TBase<children extends boolean = false> = {
		className?: string | Array<string>
	} & (children extends true ? {children?: React.ReactNode} : {})

	/**
	 * Local type shorthands
	 */
	type Anchor = React.AnchorHTMLAttributes<HTMLAnchorElement>
	type Button = React.ButtonHTMLAttributes<HTMLButtonElement>
	type Input = React.InputHTMLAttributes<HTMLInputElement>
	type Textarea = React.TextareaHTMLAttributes<HTMLTextAreaElement>
	type Div = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	type TableCell = React.TdHTMLAttributes<HTMLTableCellElement>

	/**
	 * Specific HTML elements with optional inline omits
	 */
	export type THTMLAnchor<omits extends (keyof Anchor)[]=[]> = Omit<Anchor, omits[number]>;
	export type THTMLButton<omits extends (keyof Button)[]=[]> = Omit<Button, omits[number]>;
	export type THTMLInput<omits extends (keyof Input)[]=[]> = Omit<Input, omits[number]>;
	export type THTMLTextarea<omits extends (keyof Textarea)[]=[]> = Omit<Textarea, omits[number]>;
	export type THTMLDiv<omits extends (keyof Div)[]=[]> = Omit<Div, omits[number]>
	export type THTMLTableCell<omits extends (keyof TableCell)[]=[]> = Omit<TableCell, omits[number]>
}