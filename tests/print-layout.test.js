const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

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
