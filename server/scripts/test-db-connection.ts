import { Client } from 'pg';
import dotenv from 'dotenv';

console.log("SCRIPT IS STARTING...");

dotenv.config();

// Safety Check: Did the .env load?
if (!process.env.DB_USER) {
  console.error("ERROR: Could not find .env variables!");
  console.error("  Make sure you are running this command from the 'server' folder.");
  process.exit(1);
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
    console.log(`Attempting to connect to database: ${process.env.DB_NAME}...`);
    
    await client.connect();
    
    console.log('Connection Successful!');
    
    const res = await client.query('SELECT NOW() as current_time, version();');
    
    console.log('------------------------------------------------');
    console.log('Server Time:', res.rows[0].current_time);
    console.log('Postgres Version:', res.rows[0].version);
    console.log('------------------------------------------------');
    console.log('EVERYTHING IS WORKING CORRECTLY');

  } catch (err) {
    console.error('Connection Failed.');
    console.error(err);
  } finally {
    await client.end();
  }
};

testConnection();