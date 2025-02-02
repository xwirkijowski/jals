const transition = {
	duration: .15,
}

export const container = {
	hidden: {
		opacity: 0,
		transform: "scale(0.9)",
		transition,
	},
	show: {
		opacity: 1,
		transform: "scale(1)",
		transition: {
			staggerChildren: .1,
			...transition
		}
	}
}

export const item = {
	hidden: {
		opacity: 0,
		transform: "scale(0.9)",
		transition,
	},
	show: {
		opacity: 1,
		transform: "scale(1)",
		transition,
	}
}

export const staggerFade = {container, item}