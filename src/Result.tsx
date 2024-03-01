import { useLocation } from 'react-router-dom';

function Result() {
    const location = useLocation();
    const itinerary = location.state.response
    return(
        <>{itinerary}</>
    )
}


export default Result
