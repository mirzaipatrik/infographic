import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const infographicSource = readFileSync(resolve(root, "components/Infographic.tsx"), "utf8");
const globalStyles = readFileSync(resolve(root, "app/globals.css"), "utf8");

test("print layout lets category columns expand instead of clipping content", () => {
  assert.doesNotMatch(infographicSource, /print:\[grid-auto-rows:/);
  assert.doesNotMatch(infographicSource, /print-category-column/);
  assert.doesNotMatch(globalStyles, /\.print-category-column\s*\{[^}]*break-inside:\s*avoid/s);

  assert.match(infographicSource, /print:h-auto/);
  assert.match(infographicSource, /print:overflow-visible/);
});
