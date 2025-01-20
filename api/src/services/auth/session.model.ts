import crypto from 'node:crypto';
import { Repository, Schema } from 'redis-om';

import { client } from '@/database/redis';

export const repository = new Repository(new Schema(
	'session', {
		userId: {type: 'string'},
		isAdmin: {type: 'boolean'},
		userAgent: {type: 'string'},
		userAddr: {type: 'string'},
		createdAt: {type: 'date'},
		updatedAt: {type: 'date'},
		version: {type: 'number'},
	},
	{
		dataStructure: 'JSON',
		idStrategy: async () =>  crypto.randomBytes(64).toString('hex'),
	}
), client);

client.on('ready', async () => {
	await repository.createIndex();
})