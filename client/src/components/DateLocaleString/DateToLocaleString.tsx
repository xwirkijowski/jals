"use client";

import React, {useEffect, useState} from "react";
import {Spinner} from "@comp/Spinner/Spinner";

export const DateToLocaleString = ({value}: {value: string}): React.ReactNode => {
	const [date, setDate] = useState<string|null>(null);

	useEffect(() => {
		setDate(new Date(value).toLocaleString())
	}, [])

	return (
		<>
			{!date && <Spinner />}
			{date && date}
		</>
	)
}