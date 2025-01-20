import mongoose, {Schema} from 'mongoose';

import {IClick} from "./click.types";

export default mongoose.model<IClick>(
	'Click',
	new mongoose.Schema<IClick>({
		linkId: {
			type: Schema.Types.ObjectId,
			ref: "Link",
			required: true,
			index: true
		},
		userAgent: {
			type: String,
			index: true,
		},
		platform: {
			type: String,
			index: true,
		},
		isMobile: {
			type: Boolean,
		},
		ipAddress: {
			type: String,
			index: true,
		},
		createdAt: {
			type: String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
		},
	},{
		versionKey: false
	})
);