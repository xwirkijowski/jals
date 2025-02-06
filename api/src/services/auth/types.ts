import {Entity} from "redis-om";

import {ERequestAuthCodeAction} from "@schema/@session/session.types";
import {TSettings} from "@type/config.types";

export type TSettingsAuth = TSettings['auth'];

export interface IAuthCode {
    authCodeId?: string
    userId?: string;
    userEmail: string
    action: ERequestAuthCodeAction
    code?: string
    magic?: string
    createdAt?: Date | string
}

export type TAuthCode = {
    authCodeId?: string
    userId?: string;
    userEmail: string
    action: ERequestAuthCodeAction
    code?: string
    magic?: string
    createdAt?: Date | string
}

export interface IAuthCodeEntity extends IAuthCode, Entity {}

export interface ISession {
    sessionId?: string
    userId: string;
    isAdmin: boolean
    userAgent?: string
    userAddr?: string
    createdAt?: Date|string
    updatedAt?: Date|string
    version?: number
}

export type TSession = {
    sessionId?: string
    userId: string;
    isAdmin: boolean
    userAgent?: string
    userAddr?: string
    createdAt?: Date|string
    updatedAt?: Date|string
    version?: number
}

export interface ISessionEntity extends ISession, Entity {}