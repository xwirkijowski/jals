import * as Sentry from "@sentry/node";
import {globalLogger as log} from "./log";

// Types
import {NodeClient} from "@sentry/node";
import {TConfig} from "../../types/config.types";

export let sentryClient: undefined|NodeClient;

export const setupSentry = (config: TConfig): void => {
    if (config) {
        sentryClient = Sentry.init({
            dsn: config.secrets?.sentry,
            enabled: !!(config.secrets.sentry),
            integrations: [],
            tracesSampleRate: 1.0, //  Capture 100% of the transactions
            environment: config.server.env
        });

        log.std('Sentry client initialized');
    } // @todo Handle
}