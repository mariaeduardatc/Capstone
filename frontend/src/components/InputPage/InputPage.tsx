import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './InputPage.css'
import promptImage from '../../assets/Travel.png'
import { LoadingContext } from '../App/App';
import APIClient from '../../api/client';
import { ApiResponse, Errors } from '../../types/types';
import { ToastContainer, toast } from 'react-toastify';

export default function InputPage() {
    const navigate = useNavigate();
    const { setIsLoading } = useContext(LoadingContext);
    const [tripDetails, setTripDetails] = useState({
        city: '',
        duration: ''
    });
    const [error, setError] = useState<Errors>();

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
            console.log(res)

            if (res?.body) {
                setIsLoading(false);
                navigate("/result", { state: { response: res.body, city: tripDetails.city, days: tripDetails.duration } });
            }

        } catch (err: any) {
            setIsLoading(false);

            if (err instanceof Error) {
                setError({ message: err.message });
                console.log(error)
            } else if (err.response && err.response.data) {
                setError({
                    message: err.response.data.message || "An error occurred",
                    status: err.response.status,
                });
            } else {
                setError({ message: "An unknown error occurred" });
            }

            toast.error("We could not generate an itinerary at this moment. Try again later.");
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={6000} hideProgressBar={false} />
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
                                max="4"
                                step="1"
                                value={tripDetails.duration}
                                onChange={handleTripDetails} />
                            <input type="submit" value="Submit" onClick={(e) => getItinerary(e)} className='submitButton' />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
