import React from "react";
import cx from "classnames";

import {H1} from "@comp/typography";
import {LinksTableSkeleton} from "@comp/@dashboard/links-table";
import {Placeholder} from "@comp/placeholder/placeholder";

export default function Loading () {
	return (
		<div className={"w-full flex-col flex gap-8"}>
			<H1><Placeholder width={'1\/2'} /></H1>
			<div className={cx("grid grid-cols-4 grid-rows-4 gap-8 flex-1")}>
				<LinksTableSkeleton/>
			</div>
		</div>
	)
}