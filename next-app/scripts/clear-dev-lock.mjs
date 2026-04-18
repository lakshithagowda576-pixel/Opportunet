import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const lock = path.join(root, ".next", "dev", "lock")

if (fs.existsSync(lock)) {
  try {
    fs.unlinkSync(lock)
    console.log("Removed stale .next/dev/lock.")
  } catch (e) {
    console.warn("Could not remove dev lock:", e?.message ?? e)
  }
}
