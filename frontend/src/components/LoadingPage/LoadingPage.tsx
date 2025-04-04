import './LoadingPage.css'
import planeLoading from '../../assets/planeLoading.gif'

export default function LoadingPage() {
    return (
        <div id="loading">
            <img src={planeLoading} alt="loading icon of plane flying" />
            <h4>Wait for a moment, we are loading your request</h4>
        </div>
    )
}
