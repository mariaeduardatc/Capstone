import './LandingPage.css'
import planeIcon from '../../assets/aeroplaneMain.svg'
import blueDecore from '../../assets/Decore.svg'
import settings from '../../assets/settings.svg'
import smallPlane from '../../assets/smallPlane.svg'
import diskette from '../../assets/diskette.png'
import visuals from '../../assets/visuals.svg'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const navigate = useNavigate();
    const handleInput = () => {
        navigate('/prompt');
    }
    return (
        <div id='landingPage'>
            <div id='hero'>
                <img src={blueDecore} alt="blue background shape" id='blueDecor' />
                <div>
                    <h3>Plan and enjoy the best in life</h3>
                    <h1>See what <br /> good traveling <br />can do</h1>
                    <button onClick={handleInput}>Start Planning</button>
                </div>
                <div>
                    <img src={planeIcon} alt="plane icon with plane windows on the background" />
                </div>

            </div>
            <div className='triplePattern'>
                <h4>Create your Itinerary</h4>
                <h2>How to get started on your journey</h2>
                <div className='cardDeck'>
                    <div className='card'>
                        <img src={smallPlane} alt="small blue plane icon" />
                        <h5>Inform the details of your trip</h5>
                        <p>Fill the form and indicate all the details of your trip from city, number of days to preferences of places.</p>
                    </div>
                    <div className='card'>
                        <img src={settings} alt="settings icon" />
                        <h5><br />Change any details</h5>
                        <p>Change the order of the places in your itinerary. Add days and costumized places to your plans.</p>
                    </div>
                    <div className='card'>
                        <img src={diskette} alt="diskette icon" id='disk'/>
                        <h5><br />Save and share your itinerary</h5>
                        <p>Login to register your favorite itineraries. Save them to your account to check and edit later.</p>
                    </div>
                </div>
            </div>
            <div className='triplePattern' id='saveItinerary'>
                <h4>Create your account</h4>
                <h2>Save your journeys for easy access</h2>
                <img src={visuals} alt="visual showing how to edit itinerary" />
            </div>
        </div>
    )

}

export default LandingPage
