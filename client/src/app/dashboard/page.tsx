"use client";

import React, {useContext, useState} from "react";
import {AuthContext} from "../../contexts/auth/auth.context";
import {useRouter} from "next/navigation";

export default () => {
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