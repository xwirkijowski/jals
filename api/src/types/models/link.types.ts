import {HydratedDocument, Types} from 'mongoose';

export interface LinkFlagInterface {
    note: string
    createdAt: string
    createdBy?: Types.ObjectId
}

export interface LinkInterface {
    target: string
    flags?: [LinkFlagInterface]
    active: boolean
    createdAt: string
    createdBy?: Types.ObjectId
    updatedAt: string
    updatedBy?: Types.ObjectId
    version: number
}

export type HydratedLink = HydratedDocument<LinkInterface>