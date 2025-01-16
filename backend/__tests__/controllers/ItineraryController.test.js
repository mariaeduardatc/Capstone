const ItineraryController = require('../../app/controllers/ItineraryController');
const ItineraryModel = require('../../app/models/ItineraryModel');

jest.mock('../../app/models/ItineraryModel');
jest.mock('express-async-handler', () => (handler) => handler);

describe('ItineraryController', () => {
    let itineraryController;
    let mockReq;
    let mockRes;

    beforeEach(() => {
        itineraryController = new ItineraryController();
        ItineraryModel.mockClear();

        mockReq = {
            body: {},
            query: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('processSaveItinerary', () => {
        it('should save an itinerary and return 200 status', async () => {
            const mockItineraryData = {
                destination: 'Paris',
                dates: ['2024-07-01', '2024-07-07']
            };
            mockReq.body = mockItineraryData;

            const mockSaveResponse = {
                success: true,
                itineraryId: 'abc123'
            };
            itineraryController.itineraryModel.saveItinerary = jest.fn()
                .mockResolvedValue(mockSaveResponse);

            await itineraryController.processSaveItinerary(mockReq, mockRes);

            expect(itineraryController.itineraryModel.saveItinerary)
                .toHaveBeenCalledWith(mockItineraryData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockSaveResponse);
        });

        it('should handle errors when saving an itinerary', async () => {
            const mockError = new Error('Save failed');
            itineraryController.itineraryModel.saveItinerary = jest.fn()
                .mockRejectedValue(mockError);

            try {
                await itineraryController.processSaveItinerary(mockReq, mockRes);
            } catch (error) {
                expect(error).toBe(mockError);
            }
        });
    });

    describe('processGetItinerary', () => {
        it('should retrieve an itinerary by ID and return 200 status', async () => {
            const mockItineraryId = 123;
            mockReq.query = { [mockItineraryId]: '' };

            const mockGetResponse = {
                id: mockItineraryId,
                destination: 'Tokyo'
            };
            itineraryController.itineraryModel.getItineraryById = jest.fn()
                .mockResolvedValue(mockGetResponse);

            await itineraryController.processGetItinerary(mockReq, mockRes);

            expect(itineraryController.itineraryModel.getItineraryById)
                .toHaveBeenCalledWith(mockItineraryId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockGetResponse);
        });

        it('should handle scenarios with invalid or non-existent ID', async () => {
            const invalidId = 999;
            mockReq.query = { [invalidId]: '' };

            const mockErrorResponse = {
                error: 'Itinerary not found'
            };
            itineraryController.itineraryModel.getItineraryById = jest.fn()
                .mockResolvedValue(null);

            await itineraryController.processGetItinerary(mockReq, mockRes);

            expect(itineraryController.itineraryModel.getItineraryById)
                .toHaveBeenCalledWith(invalidId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(null);
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })
});