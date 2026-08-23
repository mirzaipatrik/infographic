import { execFileSync } from "node:child_process";
import { join } from "node:path";

const supabaseBin = join(process.cwd(), "node_modules", ".bin", "supabase");

execFileSync(supabaseBin, ["db", "push", "--yes"], { stdio: "inherit" });
execFileSync(supabaseBin, ["db", "query", "-f", "supabase/seed.sql"], {
  stdio: "inherit",
});

console.log("Database schema and seed applied.");
