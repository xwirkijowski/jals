import {InternalError, ErrorAggregator} from "./errors/internal.error";
import CriticalError from "./errors/critical.error";
import FatalError from "./errors/fatal.error";
import {Warning, WarningAggregator} from "./errors/warning";

export {
	InternalError,
	CriticalError,
	FatalError,
	ErrorAggregator,
	Warning,
	WarningAggregator,
}