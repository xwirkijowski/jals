import {Eudoros} from 'eudoros';

const config = {
	options: {
		outputDirectory: './logs',
		synchronous: true,
		formatArgs: false,
	},
	levels: [
		{ // Critical errors that cause performance degradation or shutdown
			label: 'fatal',
			consoleMethodName: 'fatal',
			prefix: `\x1b[1m\x1b[31m[\u{2717}]\x1b[0m`, // Bold, red
			format: ['\x1b[1m\x1b[31m', '\x1b[0m'], // Bold, red
			trace: {
				groupLabel: 'Fatal error occurred.',
				groupPrefix: '\x1b[1m\x1b[31m[\x1b[33m\u{26A0}\x1b[31m]\x1b[0m',
				format: ['\x1b[31m', '\x1b[0m'],
			},
			logToFile: true,
		},
		{ // Critical errors that cause performance degradation or shutdown
			label: 'critical',
			consoleMethodName: 'error',
			prefix: `\x1b[1m\x1b[31m[\u{2717}]\x1b[0m`, // Bold, red
			format: ['\x1b[1m\x1b[31m', '\x1b[0m'], // Bold, red
			trace: {
				groupLabel: 'Critical error occurred.',
				groupPrefix: '\x1b[1m\x1b[31m[\u{26A0}]\x1b[0m',
				format: ['\x1b[31m', '\x1b[0m'],
			},
			logToFile: true,
		},
		{ // Non-critical errors
			label: 'error',
			consoleMethodName: 'error',
			prefix: `\x1b[31m[\u{2717}]\x1b[0m`, // Red
			format: ['\x1b[31m', '\x1b[0m'], // Red
			trace: {
				groupLabel: 'Non-critical error occurred.',
				groupPrefix: '\x1b[31m[\u{26A0}]\x1b[0m',
				format: ['\x1b[31m', '\x1b[0m'],
			},
			logToFile: true,
		},
		{ // Warnings, expected exceptions
			label: 'warn',
			consoleMethodName: 'warn',
			prefix: `\x1b[33m[\u{26A0}]\x1b[0m`, // Yellow
			format: ['\x1b[33m', '\x1b[0m'], // Yellow
			logToFile: true,
		},
		{
			label: 'success',
			prefix: `\x1b[32m[\u{2713}]\x1b[0m`, // Green
			format: ['\x1b[32m', '\x1b[0m'], // Green
			logToFile: true,
		},
		{ // Standard logging
			label: 'log',
			prefix: '[>]',
			format: [],
			logToFile: true,
			method: 'std'
		},
		{ // Authentication and authorization logging
			label: 'audit',
			method: 'audit',

			prefix: '\x1b[35m[\x1b[33m\u{1F441}\x1b[35m]\x1b[0m',
			format: ['\x1b[35m', '\x1b[0m'],
			logToFile: 'audit',
		},
		{ // Information
			label: 'info',
			consoleMethodName: 'info',
			prefix: '\x1b[34m[\u{0069}]\x1b[0m',
			format: ['\x1b[34m', '\x1b[0m'],
			logToFile: true,
		},
		{ // Debugging
			label: 'debug',
			consoleMethodName: 'debug',
			prefix: '[D]',
			format: [],
			logToFile: 'debug',
		},
		{ // Request logging
			label: 'request',
			prefix: '[>]',
			format: [],
			logToFile: 'request',
			formatToString: (payload) => {
				payload = payload[0];

				return `Request ${payload.requestId} finished in ${payload.time}ms, received at ${payload.timestampStart.toISOString()}, session: ${payload?.sessionId||false}`
			}
		},
	]
}

export const globalLogger = new Eudoros(config);
