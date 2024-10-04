import '../InputPage/InputPage.css'
import './LoginPage.css'
import loginPlane from '../../assets/loginPlane.svg'

export default function LoginPage() {

    return (
        <div id="loginPage">
            <div className="promptContainer">
                <div className='promptContainerImg'>
                    <img src={loginPlane} alt="" />
                    <h2>Welcome aboard</h2>
                    <p>just a couple of clicks and we start our journey</p>
                </div>
                <div className='prompt'>
                    <h1>Welcome</h1>
                    <form>
                        <input type='email'
                            placeholder="Email"
                            name="email" />
                        <input type="password"
                            placeholder="Password"
                            name="password" />
                        <input type="submit" value="Login" className='submitButton' id='loginButton'/>
                    </form>
                </div>
            </div>
        </div>
    )
}