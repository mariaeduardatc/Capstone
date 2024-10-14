import './Navbar.css'
import icon from '../../assets/icon.svg'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticatedUserContext } from '../App/App';
import APIClient from '../../api/client';

export default function Navbar() {
    const { isAuthenticated } = useContext(AuthenticatedUserContext)
    
    async function handleLogout() {
        const apiClient = new APIClient();
        const apiRoute = '/user/logout';
        const response = await apiClient.get(apiRoute, '', {});
        if (response.ok) {
            window.location.reload();
        }
    };

    const navBody = isAuthenticated !== null ? (
        <>
            <div className='icon'>
                <Link to='/'>
                    <img src={icon} alt="logo" />
                </Link>
            </div>
            <div className='instructionButtons'>
                <Link to='/userpage'>
                    <button className='darkButton'>Itineraries</button>
                </Link>
                <Link to='/'>
                    <button onClick={handleLogout}>Logout</button>
                </Link>
            </div>
        </>
    ) : (
        <>
            <div className='icon'>
                <Link to='/'>
                    <img src={icon} alt="logo" />
                </Link>
            </div>
            <div className='instructionButtons'>
                <Link to="/register">
                    <button className='darkButton'>Sign Up</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </>
    )

    return (
        <div id='navbar'>
            {navBody}
        </div>
    )
}
