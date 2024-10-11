const asyncHandler = require('express-async-handler');
const APIModel = require('../models/APIModel');

class MapsController {
    constructor() {
        this.mapsModel = new APIModel();
    }

    getDirections = asyncHandler(async (req, res) => {
        const { places } = req.body;

        try {
            const directionsData = await this.mapsModel.getDirectionsFromGoogleMaps(places);
            return res.status(200).json(directionsData);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}

module.exports = MapsController;
