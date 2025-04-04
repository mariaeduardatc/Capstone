const asyncHandler = require('express-async-handler');
const APIModel = require('../models/APIModel');
const cityModel = require('../models/cityModel')

class APIController {
    constructor() {
        this.apiModel = new APIModel();
        this.cityModel = new cityModel();
    }

    processPromptCompletion = asyncHandler(async (req, res, _next) => {
        const tripParams = req.body;
        const cityName = tripParams.city;
        const numberDays = tripParams.duration;
        const famousCity = await this.cityModel.fetchCityName(cityName);

        if (famousCity){
            const places = await this.cityModel.getPlacesByCity(cityName, numberDays);

            if (places.length > 0) {
                // construct the itinerary and return it
                const itinerary = this.cityModel.constructItinerary(places);
                console.log('test',itinerary);
                return res.status(200).send(itinerary);
            } else {
                return res.status(404).send({ error: "No places found for this city in the database." });
            }
            
        } else {
            console.log('using gpt')
            const completionResponse = await this.apiModel.generateChatPrompt(tripParams);
            const completionOutput = completionResponse?.choices[0].message.content;
            res.status(200).send(completionOutput);
        }
    });

    processAllPlaceInfo = asyncHandler(async (req, res, _next) => {
        const { placeName, cityName } = req.body;
    
        try {
            const summary = await this.apiModel.getWikipediaSummary({ placeName });
            const visitDuration = await this.apiModel.getVisitDurationInfo({ placeName, cityName });
            const bestTime = await this.apiModel.getBestTimeInfo({ placeName, cityName });

            const visitDurationOutput = visitDuration?.choices[0].message.content
            const bestTimeOutput = bestTime?.choices[0].message.content
    
            const finalResponse = {
                summary,
                visitDurationOutput,
                bestTimeOutput
            };
    
            res.status(200).send(finalResponse);
        } catch (err) {
            console.error('Error processing place info:', err);
            res.status(500).send({ error: 'Failed to retrieve place information.' });
        }
    });    

    processUnsplashImage = asyncHandler(async (req, res, _next) => {
        const imgReq = req.body.city;
        const query = new URLSearchParams(imgReq);
        const data = await this.apiModel.generateUnsplashImage(query);
        res.status(200).send(data);
    }); 

}

module.exports = APIController;
