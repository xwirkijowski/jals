import Counters from "../utilities/telemetryCounters";

// Types and interfaces
import {Model} from "mongoose";
import {IncomingMessage} from "node:http";
import {ConfigType} from "./config.types";
import {DatabaseStatusType} from "../utilities/database/status";
import {UserInterface} from "./models/user.types";
import {LinkInterface} from "./models/link.types";
import {ClickInterface} from "./models/click.types";
import {SessionType} from "../services/auth/session";
import {AuthServiceType} from "../services/auth/service";
import {MailServiceType} from "../services/mail/service";

export type ContextSessionUnion = SessionType|'invalid'|undefined;

export interface ContextInterface {
    session: ContextSessionUnion
    req: IncomingMessage
    pagination: ConfigType["server"]["pagination"]
    models: {
        user: Model<UserInterface>
        link: Model<LinkInterface>
        click: Model<ClickInterface>
    }
    services: {
        auth: AuthServiceType
        mail: MailServiceType
    }
    internal: {
        requestId: string
        requestPerformance: number
        requestTimestamp: Date
        statistics: {
            timeStartup: Date
            counters: typeof Counters
        }
    }
    systemStatus: DatabaseStatusType
}