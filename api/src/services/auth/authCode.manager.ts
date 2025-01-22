import crypto from "node:crypto";

import FatalError from "@util/errors/fatal.error";
import {CriticalError} from "@util/error";
import AuthCode, {TAuthCodeInstance} from "./authCode"

// Types
import {TId} from "@type/id.types";
import {TAuthCode, TSettingsAuth} from "@service/auth/types";
import {ERequestAuthCodeAction} from "@schema/@session/session.types";

/**
 * Authentication code manager
 *
 * Every method that calls other classes is enclosed in a `try...catch` to stop propagation to API response.
 *
 * @since 2.1.1
 */
export class AuthCodeManager {
	config: TSettingsAuth["code"];
	domain: string = "AuthService->Code"

	/**
	 * Construct a new manager instance
	 *
	 * @since 2.1.1
	 *
	 * @param   config          Config, options from the `settings.json` file.
	 * @return  AuthCodeManager
	 */
	constructor (config: TSettingsAuth["code"]) {
		this.config = config;
		return this;
	}

	/**
	 * Generates a cryptographically safe number string.
	 * String (code) length depends on the config, options in the `settings.json` file.
	 *
	 * Only for internal use. Throw should be caught by the invoker.
	 *
	 * @since 2.1.1
	 *
	 * @throws  FatalError  Authentication code length configuration fault
	 * @param   rId         Unique request ID
	 * @return  string      Authentication code string
	 */
	generateCode (rId: TId): string {
		const length: number = this.config.length;

		if (length <= 0) throw new FatalError("Configuration error in `config.settings.auth.code.length`.", 'CODE_CONFIG_FAULT', this.domain, true, {requestId: rId});

		let code: string = '';
		while (code.length < length) {
			const byte: number = crypto.randomBytes(1)[0];

			if (byte < 250) code += (byte % 10).toString();
		}

		return code;
	}

	/**
	 * Creates a new AuthCode
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId      ID of the user for which the code is to be created, undefined if used for registration
	 * @param   userEmail   Email address of the user for which the code is to be created
	 * @param   action      Context in which the code will be used
	 * @param   rId         Unique request ID
	 * @return  Promise<TAuthCodeInstance|undefined>
	 */
	async createNew (userId: TId|undefined, userEmail: string, action: ERequestAuthCodeAction = ERequestAuthCodeAction.LOGIN, rId: TId): Promise<TAuthCodeInstance|undefined> {
		if (ERequestAuthCodeAction.LOGIN && (!userId || !userEmail)) {
			new CriticalError('Cannot request login code, missing props!', 'CODE_REQUEST_MISSING_ARGS', this.domain, true, {requestId: rId});
			return undefined;
		} else if (!userEmail) {
			new CriticalError('Cannot request register code, missing props!', 'CODE_REQUEST_MISSING_ARGS', this.domain, true, {requestId: rId});
			return undefined;
		}
		
		userId = userId.toString();

		try {
			return await new AuthCode({userId, userEmail, action}, rId, this.generateCode).save(this.config.expiresIn, rId);
		} catch (e) {
			return undefined;
		}
	}

	/**
	 * Attempts to find an authentication code matching supplied parameters
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   userId      The ID of the user for which the code is to be created, undefined if used for registration
	 * @param   code        Authentication code string
	 * @param   action      Context in which the code will be used
	 * @param   rId         The unique request ID
	 * @return  Promise<TAuthCodeInstance|undefined>
	 */
	async retrieve (userId: TId|undefined, code: string, action: ERequestAuthCodeAction = ERequestAuthCodeAction.LOGIN, rId: TId): Promise<TAuthCodeInstance|undefined> {
		if ((action === ERequestAuthCodeAction['LOGIN'] && !userId) || !code || !rId) {
			new CriticalError('Missing arguments, cannot check AuthCode!', 'CODE_CHECK_MISSING_ARGS', this.domain, true, {requestId: rId});
			return undefined;
		}
		
		userId = userId.toString();
		
		try {
			return await AuthCode.find(userId, code, action, rId);
		} catch (e) {
			return undefined;
		}
	}
	
	/**
	 * Remove an authentication code from the database
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   node    The AuthCode instance
	 * @param   rId     The unique request ID
	 * @return  Promise<boolean>    Was AuthCode removed successfully?
	 */
	async remove (node: TAuthCodeInstance, rId: TId): Promise<boolean> {
		try {
			return await node.remove(rId);
		} catch (e) {
			return false;
		}
	}
	
	/**
	 * Remove an authentication code from the database by its ID
	 *
	 * @since   2.1.1
	 * @async
	 *
	 * @param   authCodeId    AuthCode identifier
	 * @param   rId           The unique request ID
	 * @return  Promise<boolean>    Was AuthCode removed successfully?
	 */
	async removeById (authCodeId: TAuthCode["authCodeId"], rId: TId): Promise<boolean> {
		try {
			return await AuthCode.remove(authCodeId, rId);
		} catch (e) {
			return false;
		}
	}
}

export type TAuthCodeManager = InstanceType<typeof AuthCodeManager>;