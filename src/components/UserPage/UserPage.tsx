import './UserPage.css'
import cardImage from '../../assets/cardImage.svg'

export default function UserPage() {
    return (
        <div id='userpage'>
            <header>
                <h1>Welcome Back!</h1>
                <h2>Saved Itineraries</h2>
            </header>
            <div className='tripPattern'>
                <div className='cardDeck' id='userpageDeck'>
                    <div className='card'>
                        <img src={cardImage} alt="" />
                        <h4>Trip to London</h4>
                        <h5>14 - 29 June | Solo Trip <br /> 15 day trip</h5>
                    </div>
                    <div className='card'>
                        <img src={cardImage} alt="" />
                        <h4>Trip to London</h4>
                        <h5>14 - 29 June | Solo Trip <br /> 15 day trip</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}
