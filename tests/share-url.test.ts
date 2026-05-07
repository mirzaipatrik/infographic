import assert from "node:assert/strict";
import test from "node:test";
import type { InfographicData } from "../lib/data.ts";
import { createShareUrl, parseInfographicFromSearch } from "../lib/share-url.ts";

function makeData(text: string): InfographicData {
  return {
    title: text,
    subtitle: "Shared subtitle",
    neighborhood: "Shared neighborhood",
    year: "2026",
    categories: [
      {
        id: "category",
        title: "Shared category",
        tabLabel: "Shared tab",
        description: text,
        color: "emerald",
        subcategories: [
          {
            id: "subcategory",
            name: "Shared subcategory",
            bullets: [{ id: "bullet", text }],
          },
        ],
      },
    ],
  };
}

test("share URLs round-trip literal percent sequences", () => {
  const data = makeData("Progress is 50% complete; keep SAVE%20NOW literal");
  const url = createShareUrl("https://example.com/", data);

  assert.deepEqual(parseInfographicFromSearch(new URL(url).searchParams), data);
});

test("invalid share data falls back to defaults", () => {
  const params = new URLSearchParams([["data", "{not valid json"]]);

  assert.equal(parseInfographicFromSearch(params), null);
});
