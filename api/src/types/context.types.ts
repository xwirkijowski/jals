
// Types and interfaces
import {Model} from "mongoose";
import {TConfig} from "./config.types";
import {TDatabaseStatus} from "../utilities/database/status";
import {TTelemetryCounters} from "../utilities/telemetryCounters";
import {IUser} from "../models/user.types";
import {ILink} from "../models/link.types";
import {IClick} from "../models/click.types";
import {TSession} from "../services/auth/session";
import {TAuthService} from "../services/auth/service";
import {TMailService} from "../services/mail/service";
import {IncomingMessage, ServerResponse} from "node:http";

export type UContextSession = TSession|'invalid'|undefined;

export interface IContext {
    session: UContextSession
    req: IncomingMessage
    res: ServerResponse<IncomingMessage>
    pagination: TConfig["server"]["pagination"]
    models: {
        user: Model<IUser>
        link: Model<ILink>
        click: Model<IClick>
    }
    services: {
        auth: TAuthService
        mail: TMailService
    }
    internal: {
        requestId: string
        requestPerformance: number
        requestTimestamp: Date
        statistics: {
            timeStartup: Date
            counters: TTelemetryCounters
        }
    }
    systemStatus: TDatabaseStatus
}