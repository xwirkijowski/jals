import {HydratedDocument, Types} from 'mongoose';

export interface ILinkFlag {
    note: string
    createdAt: string
    createdBy?: Types.ObjectId
}

export interface ILink {
    target: string
    clickCount?: number
    flags?: [ILinkFlag]
    active: boolean
    createdAt: string
    createdBy?: Types.ObjectId
    updatedAt: string
    updatedBy?: Types.ObjectId
    version: number
}

export type THydratedLink = HydratedDocument<ILink>