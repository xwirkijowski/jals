"use client";

import React, {useContext} from "react";
import {AuthContext} from "@ctx/auth/auth.context";
import {useRouter} from "next/navigation";

const Page = () => {
	const auth = useContext(AuthContext);
	const authValid: boolean = (auth !== null);
	const router = useRouter();

	if (!authValid) {
		router.replace("/")
	}

	return (
		<div className="grid gap-8">
			<div>Your links</div>
			<div>

			</div>
		</div>
	)
}

export default Page;