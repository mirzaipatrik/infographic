import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(path: string) {
  return readFileSync(resolve(rootDir, path), "utf8");
}

test("print layout lets category content grow instead of clipping it", () => {
  const infographic = readProjectFile("components/Infographic.tsx");
  const globalStyles = readProjectFile("app/globals.css");

  assert.match(
    infographic,
    /print:h-auto/,
    "category columns must not keep screen h-full sizing in print",
  );
  assert.match(
    infographic,
    /print:overflow-visible/,
    "category columns must not hide overflow in print/PDF output",
  );
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:/,
    "fixed print grid rows can silently drop long user-authored content",
  );
  assert.doesNotMatch(
    `${infographic}\n${globalStyles}`,
    /print-category-column/,
    "whole-column break-inside avoidance can make oversized columns unprintable",
  );
});
