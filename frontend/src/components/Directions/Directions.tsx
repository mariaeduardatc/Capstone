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
                    fullscreenControl={false}
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

    const selected = routes[0]
    
    const location = useLocation();
    const places = location.state?.places || [];
    const destinationCity = location.state?.destinationCity || '';
    const placesWithCity = places.map((place:string) => `${place}, ${destinationCity}`);
    const origin = placesWithCity[0];
    const destination = placesWithCity[places.length - 1];
    const waypoints = placesWithCity.slice(1, placesWithCity.length - 1).map((location: string) => ({ location, stopover: true }));

    // hook to initialize services
    useEffect(() => {
        if(!routesLibrary || !map) return
        setDirectionsService(new routesLibrary.DirectionsService())
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
    }, [routesLibrary, map])

    // hook to find routes using the services
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

    if (!selected) return null

    // Calculate total duration and distance
    const totalDuration = selected.legs.reduce((acc, leg) => acc + (leg.duration?.value || 0), 0);
    const totalDistance = selected.legs.reduce((acc, leg) => acc + (leg.distance?.value || 0), 0);

    // Convert to human-readable format
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours} hr ${minutes} min`;
        }
        return `${minutes} min`;
    };

    const formatDistance = (meters: number) => {
        const km = meters / 1000;
        return km >= 1 ? `${km.toFixed(1)} km` : `${meters} m`;
    };

    return (
        <div className='directions'>
            <h3>Total Journey: {formatDuration(totalDuration)} ({formatDistance(totalDistance)})</h3>
            
            {/* Individual leg details */}
            <div className="leg-details">
                {selected.legs.map((leg, index) => (
                    <div key={index} className="leg">
                        <p className="leg-title">
                            <strong>Segment {index + 1}:</strong> {leg.start_address.split(",")[0]} → {leg.end_address.split(",")[0]}
                        </p>
                        <p className="leg-info">Duration: {leg.duration?.text} | Distance: {leg.distance?.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}