import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './InputPage.css'
import promptImage from '../../assets/Travel.png'


function Input() {
    const navigate = useNavigate();

    const [tripDetails, setTripDetails] = useState({
        city: '',
        duration: ''
    })

    function handleTripDetails(e: { target: any }) {
        const { name, value } = e.target;
        setTripDetails((prevUser) => ({
        ...prevUser,
        [name]: value,
        }));
    }

    const getItinerary = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/itinerary', {
                city: tripDetails.city,
                duration: tripDetails.duration
            });
            const itinerary = response.data.itinerary;
            navigate("/result", { state: { response: itinerary, city: tripDetails.city, days: tripDetails.duration } });
        } catch (err) {
            console.error(err);
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
                        onChange={handleTripDetails}/>
                        <input type="number" 
                        placeholder="type the trip`s duration"
                        name="duration"
                        min="1"
                        step="1" 
                        value={tripDetails.duration}
                        onChange={handleTripDetails}/>
                        <input type="submit" value="Submit" onClick={(e) => getItinerary(e)} className='submitButton'/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Input
