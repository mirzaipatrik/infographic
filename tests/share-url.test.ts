import assert from "node:assert/strict";
import test from "node:test";
import { parseInfographicFromSearch } from "../lib/share-url.ts";

test("parses share data containing literal percent signs", () => {
  const data = {
    title: "100% Growth",
    subtitle: "Progress reached 75% this cycle",
    neighborhood: "Central",
    year: "2026",
    categories: [
      {
        id: "cat-1",
        title: "Teaching",
        tabLabel: "Invite",
        description: "30% more gatherings",
        color: "amber",
        subcategories: [
          {
            id: "sub-1",
            name: "Firesides",
            bullets: [{ id: "bullet-1", text: "Attendance grew by 50%" }],
          },
        ],
      },
    ],
  };

  const searchParams = new URLSearchParams(`data=${encodeURIComponent(JSON.stringify(data))}`);

  assert.deepEqual(parseInfographicFromSearch(searchParams), data);
});

test("normalizes malformed share data before rendering", () => {
  const searchParams = new URLSearchParams(
    `data=${encodeURIComponent(
      JSON.stringify({
        title: "Partial import",
        categories: [
          {
            title: "Category without children",
            color: "not-a-valid-color",
          },
        ],
      }),
    )}`,
  );

  assert.deepEqual(parseInfographicFromSearch(searchParams), {
    title: "Partial import",
    subtitle: "",
    neighborhood: "",
    year: "",
    categories: [
      {
        id: "category-0",
        title: "Category without children",
        tabLabel: undefined,
        description: undefined,
        color: "emerald",
        subcategories: [],
      },
    ],
  });
});

test("returns null for unparseable share data", () => {
  assert.equal(parseInfographicFromSearch(new URLSearchParams("data=%7B")), null);
});
