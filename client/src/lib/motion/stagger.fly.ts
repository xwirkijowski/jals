const transition = {
	duration: .15,
}

export const container = {
	hidden: {
		opacity: 0,
		transform: "translateY(-1rem)",
		transition,
	},
	show: {
		opacity: 1,
		transform: "translateY(0)",
		transition: {
			staggerChildren: .1,
			...transition
		}
	}
}

export const item = {
	hidden: {
		opacity: 0,
		transform: "translateY(-1rem)",
		transition,
	},
	show: {
		opacity: 1,
		transform: "translateY(0)",
		transition,
	}
}

export const staggerFly = {container, item}