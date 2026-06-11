import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

test("print layout does not clip long category columns", () => {
  const infographicSource = readFileSync(
    join(repoRoot, "components", "Infographic.tsx"),
    "utf8",
  );
  const globalsSource = readFileSync(join(repoRoot, "app", "globals.css"), "utf8");

  assert.doesNotMatch(
    infographicSource,
    /print:\[grid-auto-rows:/,
    "print grid rows must not be fixed, or overflowing content is clipped",
  );
  assert.doesNotMatch(
    infographicSource,
    /print-category-column/,
    "full category columns must be allowed to fragment across printed pages",
  );
  assert.doesNotMatch(
    globalsSource,
    /\.print-category-column\s*\{/,
    "global print CSS must not make whole category columns unbreakable",
  );

  const articleClass = infographicSource.match(/<article\s+className=\{`([^`]+)`\}/s);
  assert.ok(articleClass, "category article class should be present");
  assert.doesNotMatch(
    articleClass[1],
    /\bh-full\b/,
    "category columns must not be forced to fill a fixed-height print row",
  );
  assert.match(
    articleClass[1],
    /\bprint:overflow-visible\b/,
    "category columns need visible overflow in print so content is not discarded",
  );
});
