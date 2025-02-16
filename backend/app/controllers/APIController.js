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

    // processSummaryCompletion = asyncHandler(async (req, res, _next) => {
    //     const placeName = req.body;
    //     const completionResponse = await this.apiModel.getWikipediaSummary(placeName);
    //     const finalResponse = { completionResponse }
    //     res.status(200).send(finalResponse);
    // });

    // processVisitDurationInfo = asyncHandler(async (req, res, _next) => {
    //     const params = req.body
    //     const completionResponse = await this.apiModel.getVisitDurationInfo(params);
    //     const completionOutput = {completionResponse} // TODO fix this
    //     res.status(200).send(completionOutput)
    // })

    // processBestTimeInfo = asyncHandler(async (req, res, _next) => {
    //     const params = req.body // namecity, name place
    //     const completionResponse = await this.apiModel.getBestTimeInfo(params);
    //     const completionOutput = {completionResponse} // TODO fix this
    //     res.status(200).send(completionOutput)
    // })

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
