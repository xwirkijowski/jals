import {$DB} from "../utilities/database/status";
import Counters from "../utilities/telemetryCounters";

// Types and interfaces
import {Model} from "mongoose";
import {IncomingMessage} from "node:http";
import {ConfigType} from "./config.types";
import {UserInterface} from "./models/user.types";
import {LinkInterface} from "./models/link.types";
import {ClickInterface} from "./models/click.types";
import {AuthServiceType} from "../services/auth/service";
import {SessionType} from "../services/auth/session";

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
    systemStatus: typeof $DB
}