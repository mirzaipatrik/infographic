import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const infographicSource = await readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8");
const globalsSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("print layout does not clip long category content", () => {
  assert.ok(
    infographicSource.includes("print:overflow-visible"),
    "category cards must allow overflow in print so long user content remains visible",
  );
  assert.equal(
    infographicSource.includes("print:[grid-auto-rows:142mm]"),
    false,
    "print grid rows must not be fixed to one page fragment height",
  );
  assert.equal(
    globalsSource.includes(".print-category-column"),
    false,
    "full category cards must not be forced to avoid page breaks",
  );
});
