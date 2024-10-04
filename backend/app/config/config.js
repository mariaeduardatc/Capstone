// ────────────────────────────────────────────────────────────────────────
// NOTE: IMPORT THE .ENV FILE
// ────────────────────────────────────────────────────────────────────────

const dotenv = require('dotenv');
dotenv.config();

// Current Environment ("DEV", "PROD", or "TEST", assign in .env)
const CURRENT_ENV = process.env.CURRENT_ENV || "Unknown environment";

// ----- Client -----
const CLIENT_HOST = process.env.CLIENT_HOST || "localhost";
const CLIENT_PORT = process.env.CLIENT_PORT || '5173';

const CLIENT_URL = (() => {
  switch(CURRENT_ENV) {
    case "DEV":
      return `http://${CLIENT_HOST}:${CLIENT_PORT}`;
    case "PROD":
      return process.env.CLIENT_URL || `http://${CLIENT_HOST}:${CLIENT_PORT}`;
    default:
      return `http://${CLIENT_HOST}:${CLIENT_PORT}`;
  }
})();

// ----- Node.JS -----
const NODE_HOST = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return process.env.DEV_NODE_HOST || "localhost";
    case "PROD":
      return process.env.PROD_NODE_HOST || "localhost";
    case "TEST":
      return process.env.TEST_NODE_HOST || "localhost";
    default:
      return "Unknown environment.";
  }
})();

const NODE_PORT = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return Number(process.env.DEV_NODE_PORT) || 3000;
    case "PROD":
      return Number(process.env.PORT) || 3000;
    case "TEST":
      return Number(process.env.TEST_NODE_PORT) || 3000;
    default:
      return 3001;
  }
})();

// ----- PostgreSQL Database -----
const DB_USER = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return process.env.DEV_DB_USER || "postgres";
    case "PROD":
      return process.env.PROD_DB_USER || "postgres";
    case "TEST":
      return process.env.TEST_DB_USER || "postgres";
    default:
      return "Unknown environment.";
  }
})();

const DB_PASS = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return process.env.DEV_DB_PASS ? encodeURI(process.env.DEV_DB_PASS) : "postgres";
    case "PROD":
      return process.env.PROD_DB_PASS ? encodeURI(process.env.PROD_DB_PASS) : "postgres";
    case "TEST":
      return process.env.TEST_DB_PASS ? encodeURI(process.env.TEST_DB_PASS) : "postgres";
    default:
      return "Unknown environment.";
  }
})();

const DB_HOST = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return process.env.DEV_DB_HOST || "local";
    case "PROD":
      return process.env.PROD_DB_HOST || "local";
    case "TEST":
      return process.env.TEST_DB_HOST || "local";
    default:
      return "Unknown environment.";
  }
})();

// Current Database Port
const DB_PORT = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return Number(process.env.DEV_DB_PORT) || 5432;
    case "PROD":
      return Number(process.env.PROD_DB_PORT) || 5432;
    case "TEST":
      return Number(process.env.TEST_DB_PORT) || 5432;
    default:
      return 5432;
  }
})();

const DB_NAME = (() => {
  switch (CURRENT_ENV) {
    case "DEV":
      return process.env.DEV_DB_NAME || "pathaway";
    case "PROD":
      return process.env.PROD_DB_NAME || "pathaway";
    case "TEST":
      return process.env.TEST_DB_NAME || "pathaway";
    default:
      return "Unknown environment.";
  }
})();

const DB_URI = process.env.DATABASE_URL || "";

// ----- API Keys/Secrets/Tokens -----

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// JWT Secret Key
// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

// ------ Utils Environment Variables ------
const BCRYPT_WORK_FACTOR =
  CURRENT_ENV === "DEV" || CURRENT_ENV === "TEST" ? 1 : 13;

// --- Environment Variable Object Construction ---

const NODE = {
  HOST: NODE_HOST,
  PORT: NODE_PORT,
};

const DB = {
  USER: DB_USER,
  PASS: DB_PASS,
  HOST: DB_HOST,
  PORT: DB_PORT,
  URI: DB_URI,
};

const API = {
  OPENAI: OPENAI_API_KEY,
};

const UTILS = {
  BCRYPT_WORK_FACTOR: BCRYPT_WORK_FACTOR,
};

const CONFIG = {
    CURRENT_ENV,
    CLIENT_URL,
    NODE,
    DB,
    API,
    UTILS,
};

module.exports = CONFIG;
