const { Pool } = require('pg');
const CONFIG = require('../app/config/config');

const dbConfig = {
  connectionString: CONFIG.DB.URI,
  idleTimeoutMillis: 30000,
  max: 20,
};

if (CONFIG.CURRENT_ENV === 'DEV') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const db = new Pool(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("Connection error.", err.stack);
  } else {
    console.log("Successfully connected to PostgreSQL database!");
  }
});

module.exports = db;
