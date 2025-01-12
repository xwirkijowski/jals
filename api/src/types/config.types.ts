export interface IConnectionStringBuilder {
    (): string
}

type TServerConfig = {
    port: number
    host: string
    protocol: string
    env: string
    pagination: {
        perPageDefault: number
        perPageMax: number
    }
}

type TRedisConfig = {
    host: string
    port: number
    db?: string
    user?: string
    password?: string
    string?: string
    connectionString: IConnectionStringBuilder
    socket: {
        connectTimeout: number
        reconnectAttempts: number|undefined
    }
}

type TMongoConfig = {
    host: string
    port: number
    db: string
    user: string
    password: string
    opts?: string
    string?: string
    connectionString: IConnectionStringBuilder
}

type TSecretsConfig = {
    sentry?: string
    axiom?: string
    resend?: string
}

export type TSettings = {
    general?: {
        frontendAddr: string
    }
    axiom?: {
        dataset: string
    }
    auth?: {
        code: {
            length: number,
            expiresIn: number
        },
        session: {
            expiresIn: number
        }
    }
    mail?: {
        senderAddr: string
        senderName: string
    }
}

export type TConfig = {
    server: TServerConfig
    redis: TRedisConfig
    mongo: TMongoConfig
    secrets: TSecretsConfig
    settings: TSettings
};

export type TConfigDefaults = Partial<{
    [Property in keyof TConfig]: Partial<TConfig[Property]>
}>
