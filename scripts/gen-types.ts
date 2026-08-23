import { configDotenv } from "dotenv";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

configDotenv({ path: ".env.local" });
configDotenv({ path: ".env" });

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID?.trim();
if (!projectId) {
  console.warn(
    "Skipping gen-types: NEXT_PUBLIC_SUPABASE_PROJECT_ID is not set.\n" +
      "Copy .env.example → .env.local, then run `pnpm gen-types` after linking your Supabase project.\n" +
      "Using committed lib/database.types.ts for now.",
  );
  process.exit(0);
}

if (!/^[a-z0-9]{10,40}$/i.test(projectId)) {
  console.warn(
    "Skipping gen-types: NEXT_PUBLIC_SUPABASE_PROJECT_ID looks invalid.\n" +
      "Using committed lib/database.types.ts for now.",
  );
  process.exit(0);
}

const supabaseBin = join(process.cwd(), "node_modules", ".bin", "supabase");

try {
  const output = execFileSync(
    supabaseBin,
    ["gen", "types", "typescript", "--project-id", projectId, "--schema", "public"],
    { encoding: "utf8" },
  );
  writeFileSync("./lib/database.types.ts", output);
  console.log("Types written to lib/database.types.ts");
} catch {
  console.warn(
    "Skipping gen-types: Supabase CLI is not authenticated (or the request failed).\n" +
      "Run `pnpm exec supabase login` once, then `pnpm gen-types`.\n" +
      "Using committed lib/database.types.ts for now.",
  );
  process.exit(0);
}
