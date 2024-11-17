const express = require('express');
const ItineraryController = require('../controllers/ItineraryController')
const ItineraryRouter = express.Router();
const itineraryController = new ItineraryController();

ItineraryRouter.post('/saveItinerary', itineraryController.processSaveItinerary);
ItineraryRouter.get('/getItinerary', itineraryController.processGetItinerary);

module.exports = ItineraryRouter;