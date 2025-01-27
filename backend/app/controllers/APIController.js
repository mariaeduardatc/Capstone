const asyncHandler = require('express-async-handler');
const APIModel = require('../models/APIModel');

class APIController {
    constructor() {
        this.apiModel = new APIModel();
    }

    processPromptCompletion = asyncHandler(async (req, res, _next) => {
        const tripParams = req.body;
        const completionResponse = await this.apiModel.generateChatPrompt(tripParams);
        const completionOutput = completionResponse?.choices[0].message.content;
        res.status(200).send(completionOutput);
    });

    processSummaryCompletion = asyncHandler(async (req, res, _next) => {
        const placeName = req.body;
        const completionResponse = await this.apiModel.getWikipediaSummary(placeName);
        const finalResponse = { completionResponse }
        res.status(200).send(finalResponse);
    });

    processUnsplashImage = asyncHandler(async (req, res, _next) => {
        console.log('inside controller', req.body.city)
        const imgReq = req.body.city;
        const query = new URLSearchParams(imgReq);
        const data = await this.apiModel.generateUnsplashImage(query);
        res.status(200).send(data);
    }); 

}

module.exports = APIController;
