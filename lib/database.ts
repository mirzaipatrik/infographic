import type { MergeDeep } from "type-fest";
import type { InfographicData } from "@/lib/data";
import type { Database as DatabaseGenerated } from "@/lib/database.types";

export type { Json } from "@/lib/database.types";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        infographics: {
          Row: { content: InfographicData };
          Insert: { content: InfographicData };
          Update: { content?: InfographicData };
        };
      };
    };
  }
>;
