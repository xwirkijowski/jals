import {HydratedDocument, Types} from 'mongoose';

export interface IUser {
    email: string
    isAdmin: boolean
    createdAt: string
    createdBy: Types.ObjectId
    updatedAt: string
    updatedBy: Types.ObjectId
    version: number
}

export type THydratedUser = HydratedDocument<IUser>;