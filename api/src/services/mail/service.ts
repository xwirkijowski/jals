import EventEmitter from "events";
import { Resend } from "resend";

import { CriticalError } from '../../utilities/errors/index';
import { globalLogger as log } from '../../utilities/logging/log';
export { log };

export type MailServiceConfig = {
    senderAddr: string
    senderName: string
}

type ResendType = InstanceType<typeof Resend>;

export let resendClient: undefined|ResendType;

export class MailService extends EventEmitter {
    default_config: MailServiceConfig = {
        senderAddr: "jals@wirkijowski.dev",
        senderName: "Just Another Link Shortener",
    }

    #secret: string;
    config: MailServiceConfig;
    client: Resend;

    constructor (config?: MailServiceConfig, secret?: string) {
        super();

        log.withDomain('log', 'MailService', 'Loading MailService configuration...');

        this.config = {...this.default_config, ...config} // @todo Deep join

        // @todo Verify client and secret
        resendClient = new Resend(secret);
        log.withDomain('log', 'MailService', 'Resend client initialized');

        log.withDomain('success', 'MailService', 'AuthService started!')
        return this;
    }

    create = (to, data, rId) => {
        const email = new Email(to, data, this.config, rId);

        return email;
    }
}

export type MailServiceType = InstanceType<typeof MailService>;

export interface EmailDataInterface {
    authCode?: string
    userAgent?: string
    userAddr?: string
}

export class Email {
    from: string;
    to: string;
    subject: string;
    html: string;

    #requestId:  string;
    #config: MailServiceConfig;

    constructor(to: string, data: EmailDataInterface, config, rId) {
        if (!config) throw new CriticalError('No configuration provided to Email constructor!', 'EMAIL_CFG_ERROR')

        this.#config = config;
        this.#requestId = rId;



        return this;
    }

    send = async  () => {
        const {data, error} = await resend.email.send({

        })
    }


}