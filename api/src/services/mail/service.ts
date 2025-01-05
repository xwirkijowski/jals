import EventEmitter from "events";
import { Resend } from "resend";

import { CriticalError } from '../../utilities/errors/index';
import { globalLogger as log } from '../../utilities/logging/log';
import {SettingsType} from "../../types/config.types";
export { log };

import {LoginEmail} from './transactional/LoginEmail';

export type MailServiceConfig = SettingsType['mail'];

type ResendType = InstanceType<typeof Resend>;

export let resendClient: undefined|ResendType;

export class MailService extends EventEmitter {
    default_config: MailServiceConfig = {
        senderAddr: "jals@wirkijowski.dev",
        senderName: "Just Another Link Shortener",
    }

    config: MailServiceConfig;
    client: Resend;

    fromString: string;

    constructor (config?: MailServiceConfig, secret?: string) {
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

    create = (to: string, subject: string, data: Omit<EmailDataInterface, 'requestId'>, rId: string) => {
        return new Email(to, this.fromString, subject, {...data, requestId: rId});
    }
}

export type MailServiceType = InstanceType<typeof MailService>;

export interface EmailDataInterface {
    authCode?: string
    userAgent?: string
    userAddr?: string
    requestId?: string
}

class Email {
    requestId:  string;

    to: string;
    from: string;
    subject: string;

    data: object;

    constructor(to: string, from: string, subject: string, data: EmailDataInterface) {
        this.requestId = data.requestId;
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.data = data

        return this;
    }

    send = async  () => {
        if (!resendClient) throw new CriticalError(`No client initialized, cannot send mail!`, 'MAIL_NO_CLIENT', 'MailService')

        const {data, error} = await resendClient.emails.send({
            from: this.from,
            to: this.to,
            subject: this.subject,
            react: LoginEmail({...this.data, requestId: this.requestId}),
        });

        if (error) {
            throw new CriticalError(`${error.message} (${error.name})`, 'MAIL_RESEND_ERROR', 'MailService')
        }

        return data.id
    }
}