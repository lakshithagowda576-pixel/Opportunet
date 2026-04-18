import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from workspace root
config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

execSync(
  `node ../../node_modules/.pnpm/drizzle-kit@0.31.9/node_modules/drizzle-kit/bin.cjs push --config ./drizzle.config.ts`,
  { cwd: __dirname, stdio: "inherit" }
);
