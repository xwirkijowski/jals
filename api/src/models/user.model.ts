import mongoose, {Schema} from "mongoose";

import {IUser} from "./user.types";

export default mongoose.model<IUser>(
	'User',
	new mongoose.Schema<IUser>({
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

