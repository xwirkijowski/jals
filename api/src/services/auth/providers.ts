import {hash, randomBytes} from "node:crypto";

import FatalError from "@util/errors/fatal.error";
import AuthCode, {TAuthCodeInstance} from "@service/auth/authCode";

import {TSettingsAuth} from "@service/auth/types";
import {TId} from "@type/id.types";
import CriticalError from "@util/errors/critical.error";

export class CodeProvider {
	private readonly length: TSettingsAuth['code']['length'];
	readonly rId: TId;
	
	constructor(length: TSettingsAuth['code']['length'], rId: TId) {
		if (length <= 0) throw new FatalError("Configuration error in `config.settings.auth.code.length`.", 'CODE_CONFIG_FAULT', AuthCode.domain, true, {requestId: rId});
		
		this.length = length;
		this.rId = rId;
		
		return this;
	}
	
	generate (): string {
		let code: string = '';
		while (code.length < this.length) {
			const byte: number = randomBytes(1)[0];
			
			if (byte < 250) code += (byte % 10).toString();
		}
		
		return code
	}
}

/**
 * Generates a magic string based on AuthCode data.
 * String consists of authentication code, user email and a dynamic secret.
 *
 * @since 2.2.0
 */
export class MagicProvider {
	private readonly secret: string;
	readonly rId: TId;
	
	constructor(secret: string, rId: TId) {
		if (!secret) throw new CriticalError('Cannot generate magic string', 'MAGIC_NO_SECRET', AuthCode.domain, true, {requestId: rId});
		
		this.secret = secret;
		this.rId = rId;
		
		return this;
	}
	
	generate (authCode: TAuthCodeInstance): string {
		if (!authCode) throw new CriticalError('Cannot generate magic string', 'MAGIC_GENERATE_FAULT', AuthCode.domain, true, {requestId: this.rId});
		
		const payload: string = authCode.code+authCode.userEmail+this.secret;
		return hash('sha256', payload);
	}
}