// @todo Add proper types
export type TActionProps = {
	action: any
	state: any,
	pending: boolean
} & TActionPropsMode

export type TActionPropsMode = {
	mode?: 'page' | 'modal'
}