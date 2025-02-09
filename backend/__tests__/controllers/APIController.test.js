const APIController = require('../../app/controllers/APIController');
const APIModel = require('../../app/models/APIModel');


// Mock the dependencies
jest.mock('../../app/models/APIModel');
jest.mock('express-async-handler', () => (handler) => handler);

describe('APIController', () => {
    let apiController;
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {

        // Create a new instance of APIController before each test
        apiController = new APIController();

        // Reset the mock implementation
        APIModel.mockClear();

        // Setup mock request, response, and next function

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

            // Prepare mock trip parameters
            const mockTripParams = { 
                destination: 'Paris', 
                duration: 5 
            };
            mockReq.body = mockTripParams;
          
            // Mock the generateChatPrompt method
            const mockCompletionResponse = {
                choices: [{
                    message: {
                        content: 'Here is your travel itinerary for Paris...'
                    }
                }]
            };
            apiController.apiModel.generateChatPrompt = jest.fn()
                .mockResolvedValue(mockCompletionResponse);

            // Call the method
            await apiController.processPromptCompletion(mockReq, mockRes, mockNext);

            // Assertions
            expect(apiController.apiModel.generateChatPrompt)
                .toHaveBeenCalledWith(mockTripParams);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send)
                .toHaveBeenCalledWith('Here is your travel itinerary for Paris...');
        });

        it('should handle scenarios with empty or undefined response', async () => {

            // Prepare mock trip parameters
            const mockTripParams = { 
                destination: 'Tokyo', 
                duration: 7 
            };
            mockReq.body = mockTripParams;

            // Mock the generateChatPrompt method with undefined response
            const mockEmptyResponse = undefined;
            apiController.apiModel.generateChatPrompt = jest.fn()
                .mockResolvedValue(mockEmptyResponse);

            // Call the method
            await apiController.processPromptCompletion(mockReq, mockRes, mockNext);

            // Assertions
            expect(apiController.apiModel.generateChatPrompt)
                .toHaveBeenCalledWith(mockTripParams);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(undefined);
        });

        it('should handle errors when generating chat prompt', async () => {

            // Simulate an error scenario
            const mockError = new Error('API generation failed');
            apiController.apiModel.generateChatPrompt = jest.fn()
                .mockRejectedValue(mockError);

            // Wrap in try-catch to prevent unhandled promise rejection
            try {
                await apiController.processPromptCompletion(mockReq, mockRes, mockNext);
            } catch (error) {
                expect(error).toBe(mockError);
            }
        });
    });

    // Add cleanup after all tests
    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
});