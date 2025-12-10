import { Client } from 'pg';
import dotenv from 'dotenv';

console.log(" DEBUG SCRIPT STARTED...");

// 1. Load Environment Variables
dotenv.config();

// 2. Print what we loaded (to catch typos)
console.log("-----------------------------------------");
console.log(`TARGET HOST: ${process.env.DB_HOST}`);
console.log(`TARGET PORT: ${process.env.DB_PORT}`);
console.log(`USER:        ${process.env.DB_USER}`);
console.log(`DATABASE:    ${process.env.DB_NAME}`);
console.log("-----------------------------------------");

if (!process.env.DB_HOST || process.env.DB_HOST !== 'localhost') {
    console.log("  WARNING: DB_HOST is NOT 'localhost'. If you are testing locally, this might be why it hangs.");
}

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const testConnection = async () => {
  try {
    console.log("Attempting to connect (Timeout set to 5s)...");

    // Create a generic timeout promise that fails after 5 seconds
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT: Database did not respond in 5 seconds. Check Docker!')), 5000)
    );

    // Race the connection against the timeout
    await Promise.race([client.connect(), timeout]);

    console.log("CONNECTED SUCCESSFULLY!");
    
    // Run a quick query
    const res = await client.query('SELECT NOW() as time, version();');
    console.log(` Database Time: ${res.rows[0].time}`);
    console.log(` Version:       ${res.rows[0].version}`);

  } catch (err: any) {
    console.error("\n CONNECTION FAILED:");
    console.error(err.message);
    
    if (err.message.includes('ECONNREFUSED')) {
        console.error(" HINT: Docker is not running or port 5432 is not mapped.");
    }
    if (err.message.includes('password authentication failed')) {
        console.error(" HINT: Check DB_PASSWORD in your .env file.");
    }
  } finally {
    await client.end();
  }
};

testConnection();