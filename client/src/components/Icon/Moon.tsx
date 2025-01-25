'use client';

import React from "react";
import { motion, Variants, Transition } from 'motion/react';

import {TIconProps} from "@comp/Icon/common.types";

const svgVariants: Variants = {
	normal: {
		rotate: 0,
	},
	animate: {
		rotate: [0, -10, 10, -5, 5, 0],
	},
};

const svgTransition: Transition = {
	duration: 1.2,
	ease: 'easeInOut',
};

export const MoonIcon = ({controls}: TIconProps): React.ReactNode => {
	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			variants={svgVariants}
			animate={controls}
			transition={svgTransition}
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</motion.svg>
	);
};
