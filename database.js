const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Create a database connection
async function setupDatabase() {
    const db = await open({
        filename: './horoscope.db', // This file will be created
        driver: sqlite3.Database
    });

    // Create the submissions table if it doesn't exist
    await db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      location TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log('Database setup complete.');
    return db;
}

module.exports = setupDatabase;