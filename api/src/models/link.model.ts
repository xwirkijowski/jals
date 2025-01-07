import mongoose, {Schema} from 'mongoose';

import {LinkInterface} from "../types/models/link.types";

export default mongoose.model<LinkInterface>(
	'Links',
	new mongoose.Schema<LinkInterface>({
		target: {
			type: String,
			required: true,
			index: true
		},
		flags: [{
			note: {
				type: String,
				required: true
			},
			createdAt: {
				type: String,
				required: true
			},
			createdBy: {
				type: Schema.Types.ObjectId,
			},
		}],
		active: {
			type: Boolean,
		},
		createdAt: {
			type: String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
		},
		updatedAt: {
			type: String,
		},
		updatedBy: {
			type: Schema.Types.ObjectId
		},
		version: {
			type: Number,
			default: 0
		},
	},{
		versionKey: false
	})
);