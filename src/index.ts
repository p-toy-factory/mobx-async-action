import { _endAction, _startAction } from "mobx";

const DEFAULT_ASYNC_ACTION_NAME = "mobxAsyncAction";

function baseAsyncAction<T>(
	actionName: string,
	fn: () => Promise<T>,
): Promise<T> {
	const info = _startAction(actionName, false, undefined);
	// The reactions will be triggered during the execution of function `_endAction`.
	return fn().finally(() => _endAction(info));
}

export function asyncAction<T>(fn: () => Promise<T>): () => Promise<T>;
export function asyncAction<T>(
	actionName: string,
	fn: () => Promise<T>,
): () => Promise<T>;

export function asyncAction<T>(
	actionNameOrFn: string | (() => Promise<T>),
	fn?: () => Promise<T>,
) {
	let actionName: string;
	let actionFn: () => Promise<T>;

	if (typeof actionNameOrFn === "function") {
		actionName = DEFAULT_ASYNC_ACTION_NAME;
		actionFn = actionNameOrFn;
	} else if (typeof actionNameOrFn === "string" && typeof fn === "function") {
		actionName = actionNameOrFn;
		actionFn = fn;
	} else {
		throw new TypeError("Invalid argument(s)");
	}

	function asyncActionThunk() {
		return baseAsyncAction(actionName, actionFn);
	}

	return asyncActionThunk;
}

export function runInAsyncAction(fn: () => Promise<void>): Promise<void> {
	return asyncAction(fn)();
}
