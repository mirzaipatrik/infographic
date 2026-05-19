import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("../components/Infographic.tsx", import.meta.url), "utf8");

test("print layout lets oversized category content remain visible", () => {
  assert.match(source, /print:overflow-visible/);
  assert.doesNotMatch(source, /print:\[grid-auto-rows:[^\]]+\]/);
});
