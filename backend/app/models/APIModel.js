const OpenAI = require('openai');
const config = require('../config/config')
const { TRIP_PROMPT, VISIT_DUR_PROMPT, VISIT_BEST_TIME_PROMPT } = require('../../app/utils/constants');


class APIModel {
    constructor() {
        this.openAi = new OpenAI({ apiKey: config.API.OPENAI });
    }

    async generateChatPrompt(tripParams) {
        const tripPrompt = TRIP_PROMPT
            .replace("{city}", tripParams.city)
            .replace("{numberDays}", tripParams.duration)
            .replace("{typeTrip}", tripParams.typeTrip);
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

    async getWikipediaSummary(title) {
        const placeName = title.placeName
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.extract;
        } catch (error) {
            console.error('Error fetching Wikipedia summary:', error);
        }
    }

    async getVisitDurationInfo(params) {
        const prompt = VISIT_DUR_PROMPT
            .replace("{placeName}", params.placeName)
            .replace("{cityName}", params.cityName)

        try {
            const completion = await this.openAi.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: prompt }],
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

    async getBestTimeInfo(params) {
        const prompt = VISIT_BEST_TIME_PROMPT
            .replace("{placeName}", params.placeName)
            .replace("{cityName}", params.cityName)

        try {
            const completion = await this.openAi.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: prompt }],
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

    async generateUnsplashImage(query) {
        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${config.API.UNSPLASH}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error fetching Unsplash API:', err);
            throw err;
        }
    }

}

module.exports = APIModel;
