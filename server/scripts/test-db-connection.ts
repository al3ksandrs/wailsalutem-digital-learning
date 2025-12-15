import { Client } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Helper to check if run directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

export const runConnectionTest = async () => {
  if (isMainModule) {
    console.log(" DEBUG SCRIPT STARTED...");
    console.log("-----------------------------------------");
    console.log(`TARGET HOST: ${process.env.DB_HOST}`);
    console.log("-----------------------------------------");
  }

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    if (isMainModule) console.log("Attempting to connect...");

    await client.connect();

    if (isMainModule) console.log("CONNECTED SUCCESSFULLY!");
    
    const res = await client.query('SELECT NOW() as time, version();');
    
    if (isMainModule) {
        console.log(` Database Time: ${res.rows[0].time}`);
        console.log(` Version:       ${res.rows[0].version}`);
    }

    return true;

  } catch (err: any) {
    if (isMainModule) {
        console.error("\n CONNECTION FAILED:", err.message);
    }
    return false;
  } finally {
    await client.end();
  }
};

if (isMainModule) {
  runConnectionTest();
}