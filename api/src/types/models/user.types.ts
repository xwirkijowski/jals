import {HydratedDocument, Types} from 'mongoose';

export interface UserInterface {
    email: string
    isAdmin: boolean
    createdAt: string
    createdBy: Types.ObjectId
    updatedAt: string
    updatedBy: Types.ObjectId
    version: number
}

export type HydratedUser = HydratedDocument<UserInterface>;