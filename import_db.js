import mysql from 'mysql2/promise';
import fs from 'fs';
import 'dotenv/config';

async function importDatabase() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
        multipleStatements: true // Essential for running the full schema
    };

    console.log('Connecting to Aiven MySQL...');
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log('Reading database_schema.sql...');
        const schema = fs.readFileSync('./database_schema.sql', 'utf8');

        console.log('Importing tables and data...');
        // We use multipleStatements: true to run the whole file at once
        await connection.query(schema);

        console.log('✅ Database import successful!');
    } catch (error) {
        console.error('❌ Import failed:', error.message);
    } finally {
        await connection.end();
    }
}

importDatabase();
