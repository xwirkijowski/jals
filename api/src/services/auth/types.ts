import {Entity} from "redis-om";

import {TId} from "@type/id.types";
import {ERequestAuthCodeAction} from "@schema/@session/session.types";
import {TSettings} from "@type/config.types";

export type TSettingsAuth = TSettings['auth'];

export interface IAuthCodeGenerator {
    (rId: TId): string;
}

export interface IAuthCode {
    authCodeId?: string
    userId?: string;
    userEmail: string
    action: ERequestAuthCodeAction
    code?: string
    createdAt?: Date | string
}

export type TAuthCode = {
    authCodeId?: string
    userId?: string;
    userEmail: string
    action: ERequestAuthCodeAction
    code?: string
    createdAt?: Date | string
}

export interface IAuthCodeEntity extends IAuthCode, Entity {}

export interface ISession {
    sessionId?: string
    userId: TId;
    isAdmin: boolean
    userAgent?: string
    userAddr?: string
    createdAt?: Date|string
    updatedAt?: Date|string
    version?: number
}

export type TSession = {
    sessionId?: string
    userId: TId;
    isAdmin: boolean
    userAgent?: string
    userAddr?: string
    createdAt?: Date|string
    updatedAt?: Date|string
    version?: number
}

export interface IAuthCodeEntity extends IAuthCode, Entity {}