import {Axiom} from '@axiomhq/js';
import { globalLogger as log } from './log';

// Types
import {TConfig} from "@type/config.types";

type TAxiom = InstanceType<typeof Axiom>;

export let axiomClient: undefined|InstanceType<typeof AxiomWrapper>;

export const setupAxiom = (config: TConfig): void => {
    if (config) {
        axiomClient = new AxiomWrapper(config);
    }
}

class AxiomWrapper {
    client: TAxiom;
    dataset: string;

    constructor (config: TConfig) {
        this.dataset = config?.settings?.axiom?.dataset;

        if (!this.dataset) {
            log.warn('Dataset prefix missing in settings, Axiom disabled');
            return undefined;
        }

        this.client = new Axiom({
            token: (config) ? config?.secrets?.axiom : process.env?.SECRET_AXIOM,
        })

        log.std('Axiom client initialized');

        return this;
    }

    ingest = (subset: string|undefined = undefined, payload: object): void => {
        if (!this.client) return;

        const dataset: string = (subset) ? this.dataset+'-'+subset : this.dataset;

        this.client.ingest(dataset, payload)
    }

    getClient = (): TAxiom => this.client
}