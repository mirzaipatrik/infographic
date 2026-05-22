import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

test("print layout does not cap or clip category content", () => {
  const infographic = readFileSync(join(rootDir, "components", "Infographic.tsx"), "utf8");
  const globals = readFileSync(join(rootDir, "app", "globals.css"), "utf8");

  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must remain content-sized so tall categories can flow",
  );
  assert.doesNotMatch(
    `${infographic}\n${globals}`,
    /print-category-column/,
    "category columns must not be forced to stay on one printed page",
  );
  assert.match(
    infographic,
    /print:overflow-visible/,
    "category shells must allow overflow to remain visible in print output",
  );
});
