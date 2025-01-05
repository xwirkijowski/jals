export class DatabaseStatus {
	mongo: string;
	mongoTime?: number;
	redis: string;
	redisTime?: number;

	constructor () {
		this.mongo = 'unknown';
		this.redis = 'unknown';
	}

	setMongo (status: string) {
		this.mongo = status;
		return this;
	}

	setMongoTime (): this {
		if (!this.mongoTime) this.mongoTime = performance.now();
		return this;
	}

	getMongoTime (): number|undefined {
		const time = this.mongoTime;
		this.mongoTime = undefined;
		return time;
	}

	setRedis (status: string): this {
		this.redis = status;
		return this;
	}

	setRedisTime (): this {
		if (!this.redisTime) this.redisTime = performance.now();
		return this;
	}

	getRedisTime (): number|undefined {
		const time = this.redisTime;
		this.redisTime = undefined;
		return time;
	}
}

export const $DB = new DatabaseStatus();

export type DatabaseStatusType = InstanceType<typeof DatabaseStatus>;