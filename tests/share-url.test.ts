import assert from "node:assert/strict";
import test from "node:test";
import type { InfographicData } from "../lib/data.ts";
import { buildInfographicShareUrl, parseInfographicFromSearch } from "../lib/share-url.ts";

const dataWithPercentText: InfographicData = {
  title: "Community Progress",
  subtitle: "100% participation goal",
  neighborhood: "Central",
  year: "2026",
  categories: [
    {
      id: "cat-1",
      title: "Teaching",
      tabLabel: "Growth",
      description: "Reached 50% of households",
      color: "amber",
      subcategories: [
        {
          id: "sub-1",
          name: "Conversations",
          bullets: [{ id: "bullet-1", text: "Follow up with 25% of seekers" }],
        },
      ],
    },
  ],
};

test("share URLs round-trip user text containing percent signs", () => {
  const url = buildInfographicShareUrl(dataWithPercentText, "https://example.test");
  const parsed = parseInfographicFromSearch(new URL(url).searchParams);

  assert.deepEqual(parsed, dataWithPercentText);
});

test("invalid share payloads are ignored", () => {
  const parsed = parseInfographicFromSearch(new URLSearchParams("data=%7Bnot-json"));

  assert.equal(parsed, null);
});
