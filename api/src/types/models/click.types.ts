import {HydratedDocument, Types} from "mongoose";

export interface ClickInterface {
    linkId: Types.ObjectId
    userAgent: string
    platform: string
    isMobile?: boolean
    ipAddress?: string
    createdAt: string
    createdBy?: Types.ObjectId
}

export type HydratedClick = HydratedDocument<ClickInterface>;
