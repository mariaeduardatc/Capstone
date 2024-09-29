import './Navbar.css'
import icon from '../../assets/icon.svg'
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const handleLandingPage = () => {
        navigate('/')
    }
    return (
        <div id='navbar'>
            <header>
                <button id='icon' onClick={handleLandingPage}><img src={icon} alt="" /></button>
                <div>
                    <button id='signup'>Sign Up</button>
                    <button>Login</button>
                </div>
            </header>
        </div>

    )
}