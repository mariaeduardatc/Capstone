const express = require('express');
const apiRouter = express.Router();
const APIController = require('../controllers/APIController');

const apiController = new APIController();

apiRouter.post('/itinerary', apiController.processPromptCompletion)
apiRouter.post('/summary', apiController.processAllPlaceInfo)
apiRouter.post('/image', apiController.processUnsplashImage)

module.exports = apiRouter;
