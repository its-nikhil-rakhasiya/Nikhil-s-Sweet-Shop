import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seedDatabase() {
    try {
        const schemaPath = path.join(__dirname, '..', 'database_schema_postgres.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Running schema script...');
        await client.query(schemaSql);

        console.log('Database seeded successfully!');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();
