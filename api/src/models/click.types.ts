import {HydratedDocument, Types} from "mongoose";

export interface IClick {
    linkId: Types.ObjectId
    userAgent: string
    platform: string
    isMobile?: boolean
    ipAddress?: string
    createdAt: string
    createdBy?: Types.ObjectId
}

export type THydratedClick = HydratedDocument<IClick>;
