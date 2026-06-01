import assert from "node:assert/strict";
import test from "node:test";
import type { InfographicData } from "../lib/data.ts";
import { encodeInfographicData, parseInfographicDataParam } from "../lib/share-url.ts";

const infographic: InfographicData = {
  title: "Participation Report",
  subtitle: "100% participation with 50% youth engagement",
  neighborhood: "Central",
  year: "2026",
  categories: [
    {
      id: "cat-1",
      title: "Outreach",
      tabLabel: "Stats",
      description: "Reached 100% of invitees",
      color: "emerald",
      subcategories: [
        {
          id: "sub-1",
          name: "Follow-up",
          bullets: [{ id: "bullet-1", text: "Convert 100% commitments into visits" }],
        },
      ],
    },
  ],
};

test("share URLs round-trip infographic data containing percent signs", () => {
  const encoded = encodeInfographicData(infographic);
  const params = new URLSearchParams(`data=${encoded}`);

  assert.equal(params.get("data")?.includes("100%"), true);
  assert.deepEqual(parseInfographicDataParam(params.get("data")), infographic);
});

test("invalid share URL data falls back safely", () => {
  assert.equal(parseInfographicDataParam("%"), null);
  assert.equal(parseInfographicDataParam("{not json"), null);
  assert.equal(parseInfographicDataParam(null), null);
});
