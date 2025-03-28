const { dbClient } = require('../../database/db')

class City {

    async fetchCityName(name) {
        const query = 'SELECT name FROM famousCities WHERE name = $1;';
        const result = await dbClient.query(query, [name.toLowerCase()]);
        return result.rows[0];
    }

    async getPlacesByCity(cityName, numberDays) {
        const query = `
            SELECT id, name 
            FROM cityPlaces 
            WHERE city_id = (SELECT id FROM famousCities WHERE name = $1)
            LIMIT $2;
        `;
        const result = await dbClient.query(query, [cityName.toLowerCase(), numberDays * 3]);
        return result.rows;
    }

    // construct an itinerary from places
    constructItinerary(places) {
        const itinerary = {};
        let dayIndex = 1;

        for (let i = 0; i < places.length; i += 3) { // Grouping 3 per day
            const dayPlaces = places.slice(i, i + 3);
            itinerary[`day${dayIndex}`] = {
                title: `Day ${dayIndex}`,
                places: dayPlaces.map(place => ({
                    id: place.id,
                    name: place.name,
                    description: place.description,
                })),
            };
            dayIndex++;
        }

        return itinerary;
    }
}

module.exports = City;