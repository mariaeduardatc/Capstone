const OpenAI = require('openai');
const dotenv = require('dotenv');
const { TRIP_PROMPT } = require('../../app/utils/constants');

dotenv.config();

class APIModel {
    constructor() {
        this.openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async generateChatPrompt(tripParams) {
        const tripPrompt = TRIP_PROMPT
            .replace("{city}", tripParams.city)
            .replace("{numberDays}", tripParams.duration);
        try {
            const completion = await this.openAi.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: tripPrompt }],
                max_tokens: 3000,
                temperature: 0,
                top_p: 1,
            });
            return completion;
        } catch (err) {
            console.error('Error fetching OpenAI prompt: ', err);
            throw err;
        }
    }

}

module.exports = APIModel;
