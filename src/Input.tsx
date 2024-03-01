import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './App.css'
import OpenAI from "openai";

const openai = new OpenAI( {apiKey: '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', dangerouslyAllowBrowser: true});

function Input() {
    const navigate = useNavigate();
    const [city, setCity] = useState({
        city: ''
    })

    function handleCity(e: { target: any }) {
        console.log('city handle')
        const { name, value } = e.target;
        setCity((prevUser) => ({
        ...prevUser,
        [name]: value,
        }));
        console.log(city.city)
    }

    const getItinerary = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('inside getIntinerary')
        try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: 'Hello, I would like you to give a 3-day intinerary for ${city.city}. I am a 21 year old that likes museums, cafes, and musicals. Give me 3 things to do for each day.' }],
            model: 'gpt-3.5-turbo',
        });

        if (completion?.choices[0]){
            navigate("/result", {state: {response: completion.choices[0].message.content} });
        }
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <>
        <h1>Where are you going?</h1>
        <form>
            <input type="text" 
            placeholder='type the city name'
            name='city'
            value={city.city}
            onChange={handleCity}/>
            <input type="submit" value="Submit" onClick={(e) => getItinerary(e)} />
        </form>
        </>
    )
}

export default Input
