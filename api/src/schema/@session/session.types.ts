export enum ERequestAuthCodeAction {
    LOGIN= 'LOGIN',
    REGISTER = 'REGISTER',
}

export interface IRequestAuthCodeInput {
    email: string,
    action?: ERequestAuthCodeAction
    userAgent?: string
    userAddr?: string
}

export interface IAuthInput {
    email: string,
    code?: string,
    magic?: string,
    userAgent?: string
    userAddr?: string
}