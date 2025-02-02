const transition = {
	duration: .15,
}

export const variants = {
	hidden: {
		opacity: 0,
		transform: "scale(.8) translateX(2rem)",
		transition,
	},
	show: {
		opacity: 1,
		transform: "scale(1) translateX(0)",
		transition: {
			duration: transition.duration * 2,
		},
	}
}