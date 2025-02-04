export const inputStyles: string[] = [
	'flex-1 w-full col-span-full',
	'outline-none resize-none ',
	'trans',
	'bg-white text-zinc-600 text-md caret-orange-500',
	'rounded-xl',
	'border border-zinc-200 px-4 py-3',
	'placeholder:text-zinc-600/50',
	'group-focus-within:border-orange-500 focus:border-orange-500',
	'disabled:border-orange-500',
	'[&:invalid:not(:placeholder-shown)]:!border-red-500 [&:invalid:not(:placeholder-shown)]:!caret-red-500',
	'valid:!border-green-500 valid:!caret-green-500',
	'autofill:!shadow-[inset_0_0_0px_1000px_rgba(255,255,255)] dark:!shadow-[inset_0_0_0px_1000px_rgba(31,41,55)]',
	'autofill:!shadow-[inset_0_0_0px_1000px_rgba(255,255,255)] dark:autofill:!shadow-[inset_0_0_0px_1000px_rgba(31,41,55)]',
	'dark:bg-gray-800 dark:placeholder:text-gray-400 dark:text-gray-200 dark:border-gray-700',
	'[-webkit-text-fill-color:#52525b] dark:[-webkit-text-fill-color:#e5e7eb]'
]

// @todo: Fix autofill outline or shadow (?) appearing on border-radius corners.