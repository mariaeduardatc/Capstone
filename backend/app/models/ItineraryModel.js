const {itineraryDbClient} = require('../../database/db')

class ItineraryModel {
    async saveItinerary(creds) {

        const { user_id, saved_itinerary, number_of_days, city_name, image_url } = creds;

        const result = await itineraryDbClient.query(
            `INSERT INTO itinerary (
            user_id,
            saved_itinerary,
            number_of_days,
            city_name,
            image_url
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id,
                    user_id,
                    itinerary
                    `,
            [user_id, saved_itinerary, number_of_days, city_name, image_url]
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
            image_url: item?.image_url
        }
    }

    async getItineraryById(userId) {
        const result = await itineraryDbClient.query(
            `SELECT id,
            user_id,
            saved_itinerary,
            number_of_days,
            city_name,
            image_url

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
