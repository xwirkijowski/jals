import {EntityId} from "redis-om";
import {IdType} from "../../types/id.types";

export type AuthServiceConfig = {
    mail: {
        senderAddr: string
        senderName: string
    }
    auth: {
        code: {
            length: number
            expiresIn: number
        }
        session: {
            expiresIn: number
        }
    }
}

export interface AuthCodeGenerator {
    (rId: string): string;
}

export type AuthCodeInterface = {
    [EntityId]?: string
    authCodeId?: string
    userId: IdType;
    userEmail: string
    code?: string
    createdAt?: Date | string
}

export interface SessionInterface {
    [EntityId]?: string
    sessionId?: string
    userId: IdType;
    isAdmin: boolean
    userAgent?: string
    userAddr?: string
    createdAt?: Date|string
    updatedAt?: Date|string
    version?: number
}