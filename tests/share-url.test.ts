import assert from "node:assert/strict";
import test from "node:test";

import type { InfographicData } from "../lib/data.ts";
import { encodeInfographicForUrl, parseInfographicFromSearch } from "../lib/share-url.ts";

test("shared infographics can contain literal percent signs", () => {
  const data: InfographicData = {
    title: "Community Efforts",
    subtitle: "Reached 100% of the neighborhood",
    neighborhood: "Our Neighborhood",
    year: "2026",
    categories: [
      {
        id: "category-1",
        title: "Social Action",
        tabLabel: "Neighborhood",
        description: "100% participation",
        color: "emerald",
        subcategories: [
          {
            id: "subcategory-1",
            name: "Youth",
            bullets: [{ id: "bullet-1", text: "Follow-up is 100% complete" }],
          },
        ],
      },
    ],
  };

  const searchParams = new URLSearchParams(`data=${encodeInfographicForUrl(data)}`);

  assert.deepEqual(parseInfographicFromSearch(searchParams), data);
});
