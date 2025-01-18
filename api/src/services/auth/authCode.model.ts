import { Repository, Schema } from 'redis-om';

import { client } from '@/database/redis';

export const repository = new Repository(new Schema(
	'authCode', {
		action: { type: 'string' },
		userId: { type: 'string' },
		userEmail: { type: 'string' },
		code: { type: 'string' },
		createdAt: { type: 'date' },
	},
	{
		dataStructure: 'JSON'
	}
), client);

client.on('ready', async () => {
	await repository.createIndex();
})

export default repository;