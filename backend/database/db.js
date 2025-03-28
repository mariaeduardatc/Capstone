const { Pool } = require('pg');
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

module.exports = { dbClient };
