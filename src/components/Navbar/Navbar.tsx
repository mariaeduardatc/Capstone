import './Navbar.css'
import icon from '../../assets/icon.svg'
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const handleLandingPage = () => {
        navigate('/')
    }
    const handleLogin = () => {
        navigate('/login')
    }
    const handleRegistration = () => {
        navigate('/register')
    }
    return (
        <div id='navbar'>
            <header>
                <button id='icon' onClick={handleLandingPage}><img src={icon} alt="" /></button>
                <div>
                    <button id='signup' onClick={handleRegistration}>Sign Up</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            </header>
        </div>

    )
}