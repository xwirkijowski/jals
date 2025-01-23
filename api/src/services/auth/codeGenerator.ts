import crypto from "node:crypto";

import FatalError from "@util/errors/fatal.error";
import AuthCode from "@service/auth/authCode";

import {TSettingsAuth} from "@service/auth/types";
import {TId} from "@type/id.types";

export class CodeGenerator {
	rId: TId;
	code: string;
	
	constructor(length: TSettingsAuth['code']['length'], rId: TId) {
		if (length <= 0) throw new FatalError("Configuration error in `config.settings.auth.code.length`.", 'CODE_CONFIG_FAULT', AuthCode.domain, true, {requestId: rId});
		
		let code: string = '';
		while (code.length < length) {
			const byte: number = crypto.randomBytes(1)[0];
			
			if (byte < 250) code += (byte % 10).toString();
		}
		
		this.rId = rId;
		this.code = code;
		
		return this;
	}
	
	getCode = (): string => this.code
}

export type TCode = InstanceType<typeof CodeGenerator>;