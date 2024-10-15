import './LoadingPage.css'
import planeLoading from '../../assets/planeLoading.gif'

export default function LoadingPage(){
    return(
        <div id="loading">
            <img src={planeLoading} alt="" />
            <h4>Wait for a moment, we are loading your request</h4>
        </div>
    )
}