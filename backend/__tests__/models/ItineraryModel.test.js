const ItineraryModel = require('../../app/models/ItineraryModel');

jest.mock('../../database/db', () => ({
    itineraryDbClient: {
        query: jest.fn()
    }
}));

describe('ItineraryModel', () => {
    let itineraryModel;

    beforeEach(() => {
        itineraryModel = new ItineraryModel();
        jest.clearAllMocks();
    });

    describe('saveItinerary', () => {
        it('should save an itinerary and return the created itinerary', async () => {
            const mockCredentials = {
                user_id: '123',
                saved_itinerary: JSON.stringify({ days: ['Day 1', 'Day 2'] }),
                number_of_days: 2,
                city_name: 'Paris'
            };

            const mockQueryResult = {
                rows: [{
                    id: '1',
                    user_id: '123',
                    itinerary: mockCredentials.saved_itinerary,
                    number_of_days: 2,
                    city_name: 'Paris'
                }]
            };

            require('../../database/db').itineraryDbClient.query.mockResolvedValue(mockQueryResult);

            const result = await itineraryModel.saveItinerary(mockCredentials);

            // Assertions
            expect(require('../../database/db').itineraryDbClient.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO itinerary'),
                [
                    mockCredentials.user_id,
                    mockCredentials.saved_itinerary,
                    mockCredentials.number_of_days,
                    mockCredentials.city_name
                ]
            );

            expect(result).toEqual(expect.objectContaining({
                id: '1',
                user_id: '123'
            }));
        });
    });

    describe('getItineraryById', () => {
        it('should retrieve itineraries for a given user ID', async () => {
            const userId = '123';
            const mockQueryResult = {
                rows: [
                    {
                        id: '1',
                        user_id: '123',
                        saved_itinerary: JSON.stringify({ days: ['Day 1 plan'] }),
                        number_of_days: 1,
                        city_name: 'Rome'
                    },
                    {
                        id: '2',
                        user_id: '123',
                        saved_itinerary: JSON.stringify({ days: ['Day 1 plan', 'Day 2 plan'] }),
                        number_of_days: 2,
                        city_name: 'Paris'
                    }
                ]
            };

            require('../../database/db').itineraryDbClient.query.mockResolvedValue(mockQueryResult);

            const result = await itineraryModel.getItineraryById(userId);
            const queryMock = require('../../database/db').itineraryDbClient.query;

            expect(queryMock).toHaveBeenCalledWith(
                expect.stringMatching(/SELECT\s+id,\s*user_id,\s*saved_itinerary,\s*number_of_days,\s*city_name\s*FROM\s+itinerary\s+WHERE\s+user_id\s*=\s*\$1/i),
                [userId]
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(expect.objectContaining({
                id: '1',
                user_id: '123',
                city_name: 'Rome'
            }));
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })
});