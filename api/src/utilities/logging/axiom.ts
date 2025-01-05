import {Axiom} from '@axiomhq/js';
import { globalLogger as log } from './log';

// Types
import {ConfigType} from "../../types/config.types";

type AxiomType = InstanceType<typeof Axiom>;

export let axiomClient: undefined|AxiomType;
export let datasetPrefix: undefined|string

export const setupAxiom = (config: ConfigType):void => {
    if (config) {
        axiomClient = new Axiom({
            token: (config) ? config?.secrets?.axiom : process.env?.SECRET_AXIOM,
        })

        datasetPrefix = config?.settings?.axiom?.datasetPrefix;

        log.std('Axiom client initialized');
    }
}