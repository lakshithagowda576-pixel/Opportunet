import { db } from '../src/index';

async function main() {
  const triggers = ['OpportuNet', 'OpportuNet1', 'OpportuNet3', 'OpportuNetet2'];
  for (const t of triggers) {
    try {
      await db.execute(`DROP TRIGGER IF EXISTS "${t}" ON applications`);
      console.log(`Dropped trigger: ${t}`);
    } catch (e) {
      console.error(`Failed to drop trigger ${t}:`, e);
    }
  }
}

main().catch(console.error);
