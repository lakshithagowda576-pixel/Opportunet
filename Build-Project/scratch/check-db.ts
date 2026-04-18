import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

async function checkColumns() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
    `);
    console.log("Columns in 'jobs' table:");
    res.rows.forEach(row => console.log(` - ${row.column_name}`));
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkColumns();
