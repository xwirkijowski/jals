import crypto from 'node:crypto';
import {Repository, Schema} from 'redis-om';

import {client} from '@/database/redis';
import {ISessionEntity} from "@service/auth/types";

export const repository = new Repository<ISessionEntity>(new Schema(
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