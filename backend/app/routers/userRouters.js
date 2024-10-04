const express = require('express');
const UserController = require('../controllers/userController');
const UserRouter = express.Router();
const userController = new UserController();

UserRouter.get('/logout', userController.processLogout);
// UserRouter.get('/authenticate', userController.processAuthentication);
UserRouter.post('/register', userController.processRegister);
UserRouter.post('/login', userController.processLogin);

module.exports = UserRouter;
