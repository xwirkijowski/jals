export interface ConnectionStringBuilder {
    (): string
}

export type ConfigType = {
    server: {
        port: number
        host: string
        protocol: string
        env: string
        pagination: {
            perPageDefault: number
            perPageMax: number
        }
    }
    redis: {
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
    mongo: {
        host: string
        port: number
        db: string
        user: string
        password: string
        opts?: string
        string?: string
        connectionString: ConnectionStringBuilder
    }
};

