import {EntityId} from "redis-om";

import {TId} from "@type/id.types";
import {ERequestAuthCodeAction} from "@schema/@session/session.types";
import {TSettings} from "@type/config.types";

export type TSettingsAuth = TSettings['auth'];

export interface IAuthCodeGenerator {
    (rId: string): string;
}

export type IAuthCode = {
    [EntityId]?: string
    authCodeId?: string
    userId?: TId;
    userEmail: string
    action: ERequestAuthCodeAction
    code?: string
    createdAt?: Date | string
}

export interface ISession {
    [EntityId]?: string
    sessionId?: string
    userId: TId;
    isAdmin: boolean
    userAgent?: string
    userAddr?: string
    createdAt?: Date|string
    updatedAt?: Date|string
    version?: number
}