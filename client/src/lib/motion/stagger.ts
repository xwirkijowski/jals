export const container = {
	hidden: {
		opacity: 0,
		transform: "translateY(-1rem)",
	},
	show: {
		opacity: 1,
		transform: "translateY(0)",
		transition: {
			staggerChildren: .1
		}
	}
}

export const item = {
	hidden: {
		opacity: 0,
		transform: "translateY(-1rem)",
	},
	show: {
		opacity: 1,
		transform: "translateY(0)",
	}
}