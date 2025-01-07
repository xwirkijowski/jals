export interface ConnectionStringBuilder {
    (): string
}

type ServerConfigType = {
    port: number
    host: string
    protocol: string
    env: string
    pagination: {
        perPageDefault: number
        perPageMax: number
    }
}

type RedisConfigType = {
    host: string
    port: number
    db?: string
    user?: string
    password?: string
    string?: string
    connectionString: ConnectionStringBuilder
    socket: {
        connectTimeout: number
        reconnectAttempts: number|undefined
    }
}

type MongoConfigType = {
    host: string
    port: number
    db: string
    user: string
    password: string
    opts?: string
    string?: string
    connectionString: ConnectionStringBuilder
}

type SecretsConfigType = {
    sentry?: string
    axiom?: string
    resend?: string
}

export type SettingsType = {
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

export type ConfigType = {
    server: ServerConfigType
    redis: RedisConfigType
    mongo: MongoConfigType
    secrets: SecretsConfigType
    settings: SettingsType
};

export type ConfigDefaultsType = Partial<{
    [Property in keyof ConfigType]: Partial<ConfigType[Property]>
}>
