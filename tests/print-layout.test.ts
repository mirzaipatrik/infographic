import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readWorkspaceFile(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

test("print layout does not clip long category content", () => {
  const infographic = readWorkspaceFile("components/Infographic.tsx");
  const globals = readWorkspaceFile("app/globals.css");
  const articleClass = infographic.match(/<article\s+className=\{`([^`]+)`\}/)?.[1];

  assert.ok(articleClass, "Category article class should be present");
  assert.ok(
    articleClass.includes("print:overflow-visible"),
    "print output must allow category content to overflow/fragment instead of clipping"
  );
  assert.doesNotMatch(
    articleClass,
    /\bh-full\b/,
    "category cards must not be forced to the fixed print grid row height"
  );
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "print grid rows must remain content-sized so authored bullets are not truncated"
  );
  assert.doesNotMatch(
    globals,
    /\.print-category-column/,
    "full category cards must not opt out of print fragmentation"
  );
});
