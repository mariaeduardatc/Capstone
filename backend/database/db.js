const { Pool } = require('pg');
const CONFIG = require('../app/config/config');

const userDbClient = new Pool({
  connectionString: CONFIG.DB.URI_USER,
  idleTimeoutMillis: 30000,
  max: 20
});

const itineraryDbClient = new Pool({
  connectionString: CONFIG.DB.URI_ITINERARY,
  idleTimeoutMillis: 30000,
  max: 20
});

// Add SSL configuration for dev environment if needed
if (CONFIG.CURRENT_ENV === 'DEV') {
  userDbClient.options.ssl = { rejectUnauthorized: false };
  itineraryDbClient.options.ssl = { rejectUnauthorized: false };
}

userDbClient.connect((err) => {
  if (err) {
    console.error("Connection error to users database.", err.stack);
  } else {
    console.log("Successfully connected to users PostgreSQL database!");
  }
});

itineraryDbClient.connect((err) => {
  if (err) {
    console.error("Connection error to itineraries database.", err.stack);
  } else {
    console.log("Successfully connected to itineraries PostgreSQL database!");
  }
});

module.exports = { userDbClient, itineraryDbClient };
