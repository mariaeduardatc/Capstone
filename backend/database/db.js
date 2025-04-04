const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../app/config/config');

const dbClient = new Pool({
  connectionString: CONFIG.DB.URI_ITINERARY,
  idleTimeoutMillis: 30000,
  max: 20
});

// Add SSL configuration for dev environment if needed
if (CONFIG.CURRENT_ENV === 'DEV') {
  dbClient.options.ssl = { rejectUnauthorized: false };
}

dbClient.connect((err) => {
  if (err) {
    console.error("Connection error to users database.", err.stack);
  } else {
    console.log("Successfully connected to users PostgreSQL database!");
  }
});

async function seedDatabase() {

  await dbClient.connect();
  const sqlFilePath = path.join(__dirname, 'scripts', 'populate_cities.sql');
  const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
  await dbClient.query(sqlQuery);

  console.log("Database seeded successfully.");
}

seedDatabase().catch(console.error);

module.exports = { dbClient };
