import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");

test("print category cards do not clip overflowing user content", () => {
  assert.match(
    source,
    /overflow-hidden[^`]*print:h-auto[^`]*print:overflow-visible/,
    "print layout must override screen overflow clipping on category cards",
  );
});

test("print grid rows are not fixed to a physical page height", () => {
  assert.doesNotMatch(
    source,
    /print:\[grid-auto-rows:\d+(?:\.\d+)?(?:mm|cm|in|px|pt|rem|vh|dvh)\]/,
    "fixed print grid row heights can silently truncate long infographic content",
  );
});
