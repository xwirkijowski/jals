import {ConfigType} from "./config.types";
import {IncomingMessage} from "node:http";
import {$DB} from "../utilities/database/status";
import {AuthService} from "../services/auth/service";
import Session from "../services/auth/session";
import Counters from "../utilities/telemetryCounters";

export type ContextSessionUnion = Session|'invalid'|undefined;

export interface ContextInterface {
    session: ContextSessionUnion
    req: IncomingMessage
    pagination: ConfigType["server"]["pagination"]
    models: {
        user: any
        link: any
        click: any
    }
    services: {
        auth: AuthService
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