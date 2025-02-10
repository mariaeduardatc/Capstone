import './UserPage.css'
import APIClient from '../../api/client';
import { APIResponseDB, SavedItineraries } from '../../types/types';
import { useContext, useEffect, useState } from 'react';
import { AuthenticatedUserContext } from '../App/App';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash'

export default function UserPage() {
    const navigate = useNavigate();
    const [dbItineraries, setDbItineraries] = useState<SavedItineraries[] | []>([])
    const { isAuthenticated } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        async function loadId() {
            const userId = isAuthenticated.id;
            await showItineraries(userId);
        }
        loadId()
    }, [isAuthenticated]);

    async function getAPICall(id: string): Promise<APIResponseDB> {
        const apiClient = new APIClient();
        const apiRoute = '/itinerary/getItinerary';
        const res = await apiClient.get(apiRoute, id, {});
        return res
    }

    async function showItineraries(id: string) {
        try {
            const response = await getAPICall(id);
            if (response.ok) {
                setDbItineraries(response.body);
            }
        } catch {
            console.log("error getting itineraries")
        }
    }

    function truncate(cityName: string) {
        return cityName.slice(0, 15).concat('...')
    }

    const handleItineraryClick = (saved_itinerary: object, city_name: string, num_days: string) => {
        navigate("/result", { state: { response: saved_itinerary, city: city_name, days: num_days } });
    };

    const savedItineraries = !_.isEmpty(dbItineraries) ? (
        Object.keys(dbItineraries).map((key) => (
            <div className='card' key={dbItineraries[+key].id}
                onClick={() => handleItineraryClick(dbItineraries[+key].saved_itinerary, dbItineraries[+key].city_name, dbItineraries[+key].number_of_days)}>
                <img src={dbItineraries[+key].image_url} alt="image of trip city" />
                <div id='intineraryInfo'>
                    <h4>{dbItineraries[+key].city_name?.length >= 20 ? truncate(dbItineraries[+key].city_name) : (dbItineraries[+key].city_name)}</h4>
                    <div>
                        <h4>{dbItineraries[+key].number_of_days} Days Trip</h4>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div id='noSaveMessage'>
            <h2>You don't have any saved itineraries yet!</h2>
            <button>
                <Link to='/prompt'>
                    Start Planning
                </Link>
            </button>
        </div>
    )

    return (
        <div id='userpage'>
            <header>
                <h1>Welcome Back!</h1>
                <h2>Saved Itineraries</h2>
            </header>
            <div className='tripPattern'>
                <div className='cardDeck' id='userpageDeck'>
                    {savedItineraries}
                </div>
            </div>
        </div>
    )
}