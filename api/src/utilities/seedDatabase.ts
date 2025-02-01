import userModel from "@model/user.model";
import {setupMeta} from "@util/helpers";
import {globalLogger as log} from "@util/logging/log";
import {Warning} from "@util/errors/warning";

/**
 * Inserts initial data into database.
 *
 * @since 2.1.1
 * @async
 *
 * @return  {Promise<boolean>}
 */
export async function seedDatabase(): Promise<boolean> {
	log.withDomain("log", "Commander", "Seeding database...");
	
	const email = "sebastian@wirkijowski.dev";
	
	if (await userModel.findOne({email})) {
		log.withDomain("log", "Commander", "Initial user already exists, no need to seed database")
		return false;
	}
	
	const user = setupMeta(null, {
		email,
		isAdmin: true,
	})
	
	const userNode = await userModel.create(user);
	
	if (!userNode._id) {
		new Warning('Initial database seeding failed', 'SEED_FAIL', 'Commander', true, userNode);
	}
	
	log.withDomain("success", "Commander", "Added initial user to database!");
	return true;
}