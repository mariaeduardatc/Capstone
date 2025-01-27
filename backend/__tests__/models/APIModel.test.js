const OpenAI = require('openai');
const APIModel = require('../../app/models/APIModel');
const { TRIP_PROMPT } = require('../../app/utils/constants');

jest.mock('openai');
jest.mock('dotenv', () => ({
    config: jest.fn()
}));

describe('APIModel', () => {
    let apiModel;
    let mockOpenAI;

    beforeEach(() => {
        jest.clearAllMocks();

        mockOpenAI = {
            chat: {
                completions: {
                    create: jest.fn()
                }
            }
        };

        // mock OpenAI constructor to return the mock instance
        OpenAI.mockImplementation(() => mockOpenAI);
        apiModel = new APIModel();
    });

    describe('generateChatPrompt', () => {
        it('should generate a chat prompt with correct parameters', async () => {
            const tripParams = {
                city: 'Paris',
                duration: '3'
            };

            const expectedPrompt = TRIP_PROMPT
                .replace("{city}", tripParams.city)
                .replace("{numberDays}", tripParams.duration);

            const mockCompletion = {
                choices: [{ message: { content: 'Generated itinerary' } }]
            };
            mockOpenAI.chat.completions.create.mockResolvedValue(mockCompletion);

            const result = await apiModel.generateChatPrompt(tripParams);

            expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
                model: "gpt-3.5-turbo",
                messages: [{ 
                    role: "system", 
                    content: expectedPrompt 
                }],
                max_tokens: 3000,
                temperature: 0,
                top_p: 1,
            });

            expect(result).toBe(mockCompletion);
        });

        it('should throw an error when OpenAI call fails', async () => {
            const tripParams = {
                city: 'Paris',
                duration: '3'
            };

            const mockError = new Error('OpenAI API Error');
            mockOpenAI.chat.completions.create.mockRejectedValue(mockError);

            await expect(apiModel.generateChatPrompt(tripParams)).rejects.toThrow('OpenAI API Error');

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            try {
                await apiModel.generateChatPrompt(tripParams);
            } catch (err) {
                expect(consoleSpy).toHaveBeenCalledWith('Error fetching OpenAI prompt: ', expect.any(Error));
            }
            consoleSpy.mockRestore();
        });
    });
});