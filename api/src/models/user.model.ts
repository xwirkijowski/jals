import mongoose, {Schema} from "mongoose";

import {UserInterface} from "../types/models/user.types";

export default mongoose.model<UserInterface>(
	'User',
	new mongoose.Schema<UserInterface>({
		email: {
			type: String,
			unique: true,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
			required: true
		},
		createdAt: {
			type: String,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
		},
		updatedAt: {
			type: String,
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
		},
		version: {
			type: Number,
			default: 0,
			required: true,
		},
	}, {
		versionKey: false
	})
);

