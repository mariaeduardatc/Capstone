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
}

module.exports = APIController;
