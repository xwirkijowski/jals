'use client';

import React from "react";
import {motion, Transition, Variants} from 'motion/react';

import {TIconProps} from "@comp/Icon/common.types";

const svgVariants: Variants = {
	normal: {
		opacity: 1,
		pathLength: 1,
	},
	animate: {
		opacity: [0, 1],
		pathLength: [0, 1],
	},
};

export const CloseIcon = ({controls}: TIconProps): React.ReactNode => {
	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="4"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<motion.path
				variants={svgVariants}
				animate={controls}
				d="M18 6 6 18"
			/>
			<motion.path
				transition={{delay: 0.2}}
				variants={svgVariants}
				animate={controls}
				d="m6 6 12 12"
			/>
		</motion.svg>
	);
};

