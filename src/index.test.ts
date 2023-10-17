import { observable, reaction } from "mobx";
import { expect, test } from "vitest";

import { runInAsyncAction } from ".";

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
		},
	);

	await runInAsyncAction(async () => {
		ob.value = 2;
		await wait(1000);
		expect(hasReacted).toBeFalsy();
	});

	expect(hasReacted).toBeTruthy();
});
