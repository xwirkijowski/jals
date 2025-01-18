// Types and interfaces
import {Model} from "mongoose";
import {IncomingMessage, ServerResponse} from "node:http";
import {TConfig} from "./config.types";
import {TDatabaseStatus} from "@/database/status";
import {TTelemetryCounters} from "@util/telemetryCounters";
import {IUser} from "@model/user.types";
import {ILink} from "@model/link.types";
import {IClick} from "@model/click.types";
import {TSession} from "@service/auth/session";
import {TAuthService} from "@service/auth/service";
import {TMailService} from "@service/mail/service";

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