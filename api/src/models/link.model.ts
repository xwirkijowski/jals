import mongoose, {Schema} from 'mongoose';

import {ILink} from "./link.types";

// @todo State field instead of active

export default mongoose.model<ILink>(
	'Links',
	new mongoose.Schema<ILink>({
		target: {
			type: String,
			required: true,
			index: true
		},
		clickCount: {
			required: false,
			type: Number,
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