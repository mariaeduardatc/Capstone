const asyncHandler = require('express-async-handler');
const ItineraryModel = require("../models/ItineraryModel")

class ItineraryController {
    constructor() {
        this.itineraryModel = new ItineraryModel();
    }

    processSaveItinerary = asyncHandler(async (req, res) => {
        const itineraryInterface = req.body;
        const registerResponse = await this.itineraryModel.saveItinerary(itineraryInterface);
        res.status(200).json(registerResponse);
    });

    processGetItinerary = asyncHandler(async (req, res) => {
        const result = parseInt(Object.keys(req.query)[0]);       
        const registerResponse = await this.itineraryModel.getItineraryById(result);
        res.status(200).json(registerResponse);
     });

}

module.exports = ItineraryController;