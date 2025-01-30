import {Button} from "@comp/Button";
import {useRouter} from "next/navigation";
import {TActionPropsMode} from "@act/shared/common.types";
import React from "react";

export const CloseButton = (
	{mode}: {mode: TActionPropsMode['mode']}
): React.ReactNode => {
	const router = useRouter()

	if (mode === 'modal') {
		return(<Button btnType={'theme'} onClick={()=>router.back()}>Close</Button>)
	} else if (mode === 'page') {
		return (<Button btnType={'theme'} onClick={()=>router.push('/')}>Close</Button>);
	}
}