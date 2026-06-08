import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("print categories can flow instead of clipping overflowing content", () => {
  const infographic = fs.readFileSync(path.join(root, "components", "Infographic.tsx"), "utf8");
  const globals = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(
    infographic,
    /print:overflow-visible/,
    "category cards must allow overflowing print content to remain visible",
  );
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:142mm\]/,
    "fixed print grid rows clip long user-authored categories",
  );
  assert.doesNotMatch(
    infographic,
    /print-category-column/,
    "category-level break avoidance prevents long categories from fragmenting",
  );
  assert.doesNotMatch(
    globals,
    /\.print-category-column/,
    "global print CSS must not force category cards to stay on one page",
  );
});
