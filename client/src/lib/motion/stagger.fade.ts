export const container = {
	hidden: {
		opacity: 0,
		transform: "scale(0.9)",
	},
	show: {
		opacity: 1,
		transform: "scale(1)",
		transition: {
			staggerChildren: .1
		}
	}
}

export const item = {
	hidden: {
		opacity: 0,
		transform: "scale(0.9)",
	},
	show: {
		opacity: 1,
		transform: "scale(1)",
	}
}

export const staggerFade = {container, item}