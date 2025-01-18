import EventEmitter from "events";
import { Resend } from "resend";

import { CriticalError } from '@util/error';
import { globalLogger as log } from '@util/logging/log';
export { log };

import {TSettings} from "@type/config.types";
import {AuthCodeType} from "../auth/authCode";

import {LoginEmail} from './templates/LoginEmail';
import {ERequestAuthCodeAction} from "@schema/@session/session.types";

export type TSettingsMail = TSettings['mail'];

type TResend = InstanceType<typeof Resend>;

export let resendClient: undefined|TResend;

export class MailService extends EventEmitter {
    default_config: TSettingsMail = {
        senderAddr: "jals@wirkijowski.dev",
        senderName: "Just Another Link Shortener",
    }

    config: TSettingsMail;
    client: TResend;

    fromString: string;

    constructor (config?: TSettingsMail, secret?: string) {
        super();

        log.withDomain('log', 'MailService', 'Loading MailService configuration...');

        this.config = {...this.default_config, ...config} // @todo Deep join

        // @todo Verify client and secret
        resendClient = new Resend(secret);
        log.withDomain('log', 'MailService', 'Resend client initialized');

        this.fromString = `${this.config.senderName} <${this.config.senderAddr}>`

        log.withDomain('success', 'MailService', 'AuthService started!')
        return this;
    }

    create = (to: string, subject: string, data: Omit<IEmailData, 'requestId'>, rId: string): TEmail => {
        return new Email(to, this.fromString, subject, {...data, requestId: rId});
    }
}

export type TMailService = InstanceType<typeof MailService>;

export interface IEmailData {
    authCode?: AuthCodeType
    userAgent?: string
    userAddr?: string
    requestId?: string
    action: ERequestAuthCodeAction
}

class Email {
    requestId:  string;

    to: string;
    from: string;
    subject: string;

    data: IEmailData;

    constructor(to: string, from: string, subject: string, data: IEmailData) {
        this.requestId = data.requestId;
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.data = data

        return this;
    }

    send = async  (): Promise<string> => {
        if (!resendClient) throw new CriticalError(`No client initialized, cannot send mail!`, 'MAIL_NO_CLIENT', 'MailService')

        const {data, error} = await resendClient.emails.send({
            from: this.from,
            to: this.to,
            subject: this.subject,
            react: LoginEmail(({...this.data, requestId: this.requestId} as IEmailData)),
        });

        if (error) {
            throw new CriticalError(`${error.message} (${error.name})`, 'MAIL_RESEND_ERROR', 'MailService')
        }

        return data.id
    }
}

export type TEmail = InstanceType<typeof Email>;