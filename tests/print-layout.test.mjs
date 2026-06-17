import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("print layout does not clip oversized category content", async () => {
  const [infographic, globals] = await Promise.all([
    readFile(new URL("../components/Infographic.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(
    infographic,
    /print:overflow-visible/,
    "category cards need visible overflow in print so long content can continue onto following pages",
  );
  assert.doesNotMatch(
    infographic,
    /print:\[grid-auto-rows:[^\]]+\]/,
    "fixed print grid rows clip user-authored content that exceeds the row height",
  );
  assert.doesNotMatch(
    infographic,
    /className=\{`[^`]*\bh-full\b[^`]*`\}/,
    "category cards must not be forced to a fixed grid-row height in print",
  );
  assert.doesNotMatch(
    globals,
    /\.print-category-column/,
    "whole-card break avoidance prevents oversized cards from fragmenting across print pages",
  );
});
