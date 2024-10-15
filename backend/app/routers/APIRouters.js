const express = require('express');
const apiRouter = express.Router();
const APIController = require('../controllers/APIController');

const apiController = new APIController();

apiRouter.post('/itinerary', apiController.processPromptCompletion)

module.exports = apiRouter;
