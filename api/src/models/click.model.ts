import mongoose, {Schema} from 'mongoose';

import {ClickInterface} from "../types/models/click.types";

export default mongoose.model<ClickInterface>(
	'Click',
	new mongoose.Schema<ClickInterface>({
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