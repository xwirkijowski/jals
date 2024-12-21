import {Repository, Schema} from 'redis-om';
import {redisClient} from "../../../main.js";
import crypto from 'node:crypto';

const repository = new Repository(new Schema(
	'session', {
		userId: { type: 'string' },
		userAgent: { type: 'string' },
		userAddr: { type: 'string' },
		createdAt: { type: 'date' },
		updatedAt: { type: 'date'} ,
		version: { type: 'number' },
	},
	{
		dataStructure: 'JSON',
		idStrategy: () => {
			return crypto.randomBytes(64).toString('hex');
		}
	}
), redisClient);

redisClient.on('ready', async () => {
	await repository.createIndex();
})

export default repository;