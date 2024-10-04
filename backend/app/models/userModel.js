const bcrypt = require('bcrypt');
const dbClientInstance = require('../../database/db');
const { BadRequestError, UnauthorizedError, NotFoundError, UnprocessableEntityError } = require('../utils/errors');
const CONFIG = require('../../app/config/config');
const BCRYPT_WORK_FACTOR = CONFIG.UTILS.BCRYPT_WORK_FACTOR;

class User {
  // ----- Authentication Methods -----
  async login(creds) {
    this.notEmptyCreds(creds);
    this.areValidCreds(creds);
    await this.doesUserExist(creds.email);
    const passObj = await this.fetchUserHashedPassword(creds.email);
    await this.verifyPassword(creds.password, passObj.password);
    const userObj = await this.retrieveUserObjByEmail(creds.email);
    return userObj; // You can return user object or any info you need
  }

  async register(creds) {
    this.notEmptyCreds(creds);
    this.areValidCreds(creds);
    this.isValidEmail(creds.email);
    await this.doesEmailExist(creds.email);
    const hashedPassword = await this.hashPassword(creds.password);
    await this.insertUserIntoDatabase({ ...creds, password: hashedPassword });
    const userObj = await this.retrieveUserObjByEmail(creds.email);
    return userObj;
  } 
  
  notEmptyCreds(creds) {
    const areEmpty = Object.values(creds).some((cred) => !cred);
    if (areEmpty) {
      throw new BadRequestError('One or more credentials are empty.');
    }
  }

  areValidCreds(creds) {
    const isNil = (value) => (
      value === null || typeof value === "undefined" || String(value).trim() === ""
    );
    const areNotValid = Object.values(creds).some((cred) => isNil(cred));
    const allValuesTruthy = Object.values(creds).every(cred => !!cred);
    if (areNotValid || !allValuesTruthy) {
      throw new UnprocessableEntityError('One or more credentials were invalid.');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (!isValid) {
      throw new BadRequestError('Email is not in a valid format.');
    }
  }

  async doesUserExist(email) {
    const result = await this.fetchUserByEmail(email);
    if (!result) {
      throw new NotFoundError('User with this email was not found.');
    }
  }

  async doesEmailExist(email) {
    const result = await this.fetchUserByEmail(email);
    if (result) {
      throw new BadRequestError('Email is already in use.');
    }
  }

  async verifyPassword(loginPassword, hashedPassword) {
    const isValidPassword = await bcrypt.compare(loginPassword, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedError('Incorrect password.');
    }
  }

  // --Database Queries--
  async fetchUserByEmail(email) {
    const query = 'SELECT id, email FROM users WHERE email = $1;';
    const result = await dbClientInstance.query(query, [email.toLowerCase()]);
    return result.rows[0];
  }

  async fetchUserHashedPassword(email) {
    const query = 'SELECT password FROM users WHERE email = $1;';
    const result = await dbClientInstance.query(query, [email.toLowerCase()]);
    return result.rows[0];
  }

  async retrieveUserObjByEmail(email) {
    const query = 'SELECT id, first_name, last_name, email FROM users WHERE email = $1;';
    const result = await dbClientInstance.query(query, [email.toLowerCase()]);
    return result.rows[0];
  }

  async retrieveUserObjById(id) {
    const query = 'SELECT id, first_name, last_name, email FROM users WHERE id = $1;';
    const result = await dbClientInstance.query(query, [id]);
    return result.rows[0];
  }

  async insertUserIntoDatabase(user) {
    const {
      firstName, lastName, email, password,
    } = user;
    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);';
    await dbClientInstance.query(query, [firstName, lastName, email.toLowerCase(), password]);
  }

  // --Data Processing--
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(BCRYPT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}

module.exports =  User;
