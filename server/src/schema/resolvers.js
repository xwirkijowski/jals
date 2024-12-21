import {
	DateTimeResolver,
	EmailAddressResolver,
	IPResolver,
} from 'graphql-scalars';
import { DateTime } from "luxon";

export default {
	DateTime: DateTimeResolver,
	EmailAddress: EmailAddressResolver,
	IPAddress: IPResolver,
	PageInfo: {
		total: ({total}) => total,
		perPage: ({paginationData}) => paginationData.perPage,
		pageCount: ({pageCount}) => pageCount,
		currentPage: ({paginationData}) => paginationData.page,
		hasNextPage: ({paginationData, pageCount}) => (paginationData.page < pageCount),
		hasPreviousPage: ({paginationData, pageCount}) => (paginationData.page <= pageCount + 1 && paginationData.page > 1),
	},
	Result: {
		success: (obj) => ((typeof obj === 'boolean' && obj === true) || obj?.success === true),
		errors: (obj) => (typeof obj === 'boolean' && obj === true) ? [] : obj?.errors,
	},
	InternalStatus: {
		database: (_, __, {systemStatus}) => systemStatus.db,
		redis: (_, __, {systemStatus}) => systemStatus.redis,
		requestCount: (_, __, {internal}) => internal.statistics.requestCount,
		warningCount: (_, __, {internal}) => internal.statistics.warningCount(),
		errorCount: (_, __, {internal}) => internal.statistics.errorCount(),
		timeStartup: (_, __, {internal}) => internal.statistics.timeStartup,
		timeOnline: (_, __, {internal}) => {
			const start = DateTime.fromISO(internal.statistics.timeStartup.toISOString());
			const now = DateTime.now();

			const diff = now.diff(start, ['seconds', 'minutes', 'hours', 'days', 'months', 'years'])
				.normalize()
				.toObject();

			diff.seconds = Math.floor(diff.seconds)

			return diff;
		},
	},
	DomainStatus: {
		user: (_, __, {systemStatus}) => (systemStatus.db === 'connected') ? 'available' : 'unavailable',
		session: (_, __, {systemStatus}) => {
			if (systemStatus.redis === 'connected') return 'available';
			if (systemStatus.redis === 'connected' && systemStatus.db !== 'connected') return 'limited';
			return 'unavailable';
		},
	},
	HealthCheck: {
		timestamp: () => new Date().toISOString(),
		internal: () => true,
		domains: () => true,
	},
	Query: {
		healthCheck: () => true,
	},
}