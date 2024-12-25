export class DatabaseStatus {
	mongo
	mongoTime
	redis
	redisTime

	constructor () {
		this.mongo = false;
		this.redis = false;
	}

	setMongo (status) {
		this.mongo = status;
		return this;
	}

	setMongoTime () {
		this.mongoTime = performance.now();
		return this;
	}

	getMongoTime () {
		const time = this.mongoTime;
		this.mongoTime = undefined;
		return time;
	}

	setRedis (status) {
		this.redis = status;
		return this;
	}

	setRedisTime () {
		this.redisTime = performance.now();
		return this;
	}

	getRedisTime () {
		const time = this.redisTime;
		this.redisTime = undefined;
		return time;
	}
}

export const $DB = new DatabaseStatus();