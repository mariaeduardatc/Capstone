const fetch = (...args) => import('node-fetch').then(module => module.default(...args));

class MapsModel {
    constructor() {}

    async getDirectionsFromGoogleMaps(places) {
        if (!places || places.length < 2) {
            throw new Error('At least two places are required to get directions.');
        }

        const origin = places[0];
        const destination = places[places.length - 1];
        const waypoints = places.length > 2
            ? places.slice(1, places.length - 1).join('|')
            : '';

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const directionsData = await response.json();

            if (!response.ok) {
                throw new Error(directionsData.error_message || 'Failed to fetch directions from Google Maps API.');
            }

            return directionsData;
        } catch (error) {
            console.error('Error fetching directions from Google Maps:', error);
            throw new Error('Failed to fetch directions');
        }
    }
}

module.exports = MapsModel;
