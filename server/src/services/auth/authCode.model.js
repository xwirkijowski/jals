import { Repository, Schema } from 'redis-om';
import { redisClient } from "../../database.js";

const repository = new Repository(new Schema(
	'authCode', {
		userId: { type: 'string' },
		userEmail: { type: 'string' },
		code: { type: 'string' },
		createdAt: { type: 'date' },
	},
	{
		dataStructure: 'JSON'
	}
), redisClient);

redisClient.on('ready', async () => {
	await repository.createIndex();
})

export default repository;