import {EntityId} from "redis-om";
import {IdType} from "../../types/id.types";
import {ERequestAuthCodeAction} from "../../schema/@session/session.mutations.types";

export type AuthServiceConfig = {
    code: {
        length: number
        expiresIn: number
    }
    session: {
        expiresIn: number
    }
}

export interface AuthCodeGenerator {
    (rId: string): string;
}

export type AuthCodeInterface = {
    [EntityId]?: string
    authCodeId?: string
    userId?: IdType;
    userEmail: string
    action: ERequestAuthCodeAction
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