import {
    APIProvider,
    Map,
    useMap,
    useMapsLibrary,
} from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './Directions.css'

export default function Directions() {
    // necessary so API provider works
    const [position, setPosition] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={position}
                    defaultZoom={12}
                    mapId={mapId}
                    fullscreenControl={true}
                    gestureHandling={'auto'}
                    zoomControl={true}
                    >
                    <DirectionsRoute setPosition={setPosition}/>
                </Map>
            </APIProvider>

        </div>
    )
}

function DirectionsRoute({ setPosition }: { setPosition: (pos: { lat: number, lng: number }) => void }) {
    const map = useMap()
    const routesLibrary = useMapsLibrary("routes")
    const geocoderLibrary = useMapsLibrary("geocoding");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>()
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>()
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
    const [routeIndex, setRouteIndex] = useState(0)
    const selected = routes[routeIndex]
    const leg = selected?.legs[0]

    const location = useLocation();
    const places = location.state?.places || [];
    const origin = places[0];
    const destination = places[places.length - 1];
    const waypoints = places.slice(1, places.length - 1).map((location: string) => ({ location, stopover: true }));

    useEffect(() => {
        if(!routesLibrary || !map) return
        setDirectionsService(new routesLibrary.DirectionsService())
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
    }, [routesLibrary, map])

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService.route({
            origin,
            destination,
            waypoints,
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true,
        }).then((res) => {
            directionsRenderer.setDirections(res)
            setRoutes(res.routes)
        })

        if (geocoderLibrary) {
            const geocoder = new geocoderLibrary.Geocoder();
            geocoder.geocode({ address: origin }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const location = results[0].geometry.location;
                    setPosition({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error('Geocode was not successful:', status);
                }
            });
        }
    }, [directionsService, directionsRenderer])

    useEffect(() => {
        if (!directionsRenderer) return
        directionsRenderer.setRouteIndex(routeIndex)
    }, [routeIndex, directionsRenderer])

    if (!leg) return null

    return (
        <div className='directions'>
            <h2>{selected.summary}</h2>
            <p>{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}</p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>

            <h2>Other Routes</h2>
            <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button onClick={() => setRouteIndex(index)}>
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )

}
