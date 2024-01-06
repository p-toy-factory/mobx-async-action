# mobx-async-action

[MobX](https://mobx.js.org) asynchronous action but different with [flow](https://mobx.js.org/api.html#flow).

The reactions won't be triggered until the promise's state changes to be fulfilled or rejected.

## Install

```
npm install mobx-async-action
```

## Example

```typescript
import { observable, reaction } from "mobx";
import { expect, test } from "vitest";

import { runInAsyncAction } from "mobx-async-action";

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

test("runInAsyncAction", async () => {
	let hasReacted = false;

	const ob = observable({
		value: 1,
	});

	reaction(
		() => ob.value,
		() => {
			hasReacted = true;
		}
	);

	await runInAsyncAction(async () => {
		ob.value = 2;
		await wait(1000);
		expect(hasReacted).toBeFalsy();
	});

	expect(hasReacted).toBeTruthy();
});
```

## Caveat

If the promise's state never changes, the action may never end.

## API Reference

### asyncAction

Similar to [action](https://mobx.js.org/api.html#action), but supports asynchronous function.

```typescript
function asyncAction<T>(fn: () => Promise<T>): () => Promise<T>;

function asyncAction<T>(
	actionName: string,
	fn: () => Promise<T>
): () => Promise<T>;
```

### runInAsyncAction

Similar to [runInAction](https://mobx.js.org/api.html#runinaction), but use `asyncAction` underhood.

```typescript
function runInAsyncAction(fn: () => Promise<void>): Promise<void>;
```
