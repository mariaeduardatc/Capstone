import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './InputPage.css'
import promptImage from '../../assets/Travel.png'
import { LoadingContext } from '../App/App';
import APIClient from '../../api/client';

interface ApiResponse {
    ok: boolean;
    status: number;
    body: {
        data?: object;
        error?: {
            message: string;
            status: number;
        }
    }
}

function Input() {
    const navigate = useNavigate();
    const { setIsLoading } = useContext(LoadingContext);
    const [tripDetails, setTripDetails] = useState({
        city: '',
        duration: ''
    });

    function handleTripDetails(e: { target: any }) {
        const { name, value } = e.target;
        setTripDetails((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    }


    async function postAPICall(prompt: object): Promise<ApiResponse> {
        const apiClient = new APIClient();
        const apiRoute = '/api/itinerary';
        const response = await apiClient.post(apiRoute, prompt, {});
        return response;
    }

    const getItinerary = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const prompt = {
                city: tripDetails.city,
                duration: tripDetails.duration
            };
            const res = await postAPICall(prompt);

            if (res?.body) {
                setIsLoading(false);
                navigate("/result", { state: { response: res.body, city: tripDetails.city, days: tripDetails.duration } });
            }
            
        } catch (err) {
            setIsLoading(false);
            console.error('err', err);
        }
    };

    return (
        <div id='inputPage'>
            <div className='promptContainer'>
                <img src={promptImage} alt="" />
                <div className='prompt'>
                    <h1>Where are you going?</h1>
                    <form>
                        <input type="text"
                            placeholder="type the city name"
                            name="city"
                            value={tripDetails.city}
                            onChange={handleTripDetails} />
                        <input type="number"
                            placeholder="number of days"
                            name="duration"
                            min="1"
                            step="1"
                            value={tripDetails.duration}
                            onChange={handleTripDetails} />
                        <input type="submit" value="Submit" onClick={(e) => getItinerary(e)} className='submitButton' />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Input
