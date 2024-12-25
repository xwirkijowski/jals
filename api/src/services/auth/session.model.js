import crypto from 'node:crypto';
import { Repository, Schema } from 'redis-om';
import { client } from '../../utilities/database/redis.js';

export const repository = new Repository(new Schema(
	'session', {
		userId: {type: 'string'},
		userAgent: {type: 'string'},
		userAddr: {type: 'string'},
		createdAt: {type: 'date'},
		updatedAt: {type: 'date'},
		version: {type: 'number'},
	},
	{
		dataStructure: 'JSON',
		idStrategy: () => {
			return crypto.randomBytes(64).toString('hex');
		}
	}
), client);

client.on('ready', async () => {
	await repository.createIndex();
})