const {dbClient} = require('../../database/db')

class ItineraryModel {
    async saveItinerary(creds) {

        const { user_id, saved_itinerary, number_of_days, city_name, image_url, type_trip } = creds;

        const result = await dbClient.query(
            `INSERT INTO itinerary (
            user_id,
            saved_itinerary,
            number_of_days,
            city_name,
            image_url,
            type_trip
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id,
                    user_id,
                    itinerary
                    `,
            [user_id, saved_itinerary, number_of_days, city_name, image_url, type_trip]
        );

        const itineary = result.rows[0];

        return itineary;
    }

    _createItem(item) {
        return {
            id: item.id,
            user_id: item.user_id,
            saved_itinerary: item.saved_itinerary,
            number_of_days: item.number_of_days,
            city_name: item.city_name,
            image_url: item?.image_url,
            type_trip: item?.type_trip
        }
    }

    async getItineraryById(userId) {
        const result = await dbClient.query(
            `SELECT id,
            user_id,
            saved_itinerary,
            number_of_days,
            city_name,
            image_url,
            type_trip

           FROM itinerary
           WHERE user_id = $1`,
            [userId]
        );

        const itineraryTag = result.rows;
        const itineraryList = itineraryTag.map((itinerary) => this._createItem(itinerary));

        return itineraryList;
    }
}

module.exports = ItineraryModel;
