const APIController = require('../../app/controllers/APIController');
const APIModel = require('../../app/models/APIModel');

jest.mock('../../app/models/APIModel');
jest.mock('express-async-handler', () => (handler) => handler);

describe('APIController', () => {
    let apiController;
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        apiController = new APIController();

        APIModel.mockClear();

        mockReq = {
            body: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        mockNext = jest.fn();
    });

    describe('processPromptCompletion', () => {
        it('should generate a chat prompt and send response with 200 status', async () => {
            const mockTripParams = { 
                destination: 'Paris', 
                duration: 5 
            };
            mockReq.body = mockTripParams;

            const mockCompletionResponse = {
                choices: [{
                    message: {
                        content: 'Here is your travel itinerary for Paris...'
                    }
                }]
            };
            apiController.apiModel.generateChatPrompt = jest.fn()
                .mockResolvedValue(mockCompletionResponse);

            await apiController.processPromptCompletion(mockReq, mockRes, mockNext);

            expect(apiController.apiModel.generateChatPrompt)
                .toHaveBeenCalledWith(mockTripParams);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send)
                .toHaveBeenCalledWith('Here is your travel itinerary for Paris...');
        });

        it('should handle scenarios with empty or undefined response', async () => {
            const mockTripParams = { 
                destination: 'Tokyo', 
                duration: 7 
            };
            mockReq.body = mockTripParams;

            const mockEmptyResponse = undefined;
            apiController.apiModel.generateChatPrompt = jest.fn()
                .mockResolvedValue(mockEmptyResponse);

            await apiController.processPromptCompletion(mockReq, mockRes, mockNext);

            expect(apiController.apiModel.generateChatPrompt)
                .toHaveBeenCalledWith(mockTripParams);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(undefined);
        });

        it('should handle errors when generating chat prompt', async () => {
            const mockError = new Error('API generation failed');
            apiController.apiModel.generateChatPrompt = jest.fn()
                .mockRejectedValue(mockError);

            try {
                await apiController.processPromptCompletion(mockReq, mockRes, mockNext);
            } catch (error) {
                expect(error).toBe(mockError);
            }
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
});