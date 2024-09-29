import '../InputPage/InputPage.css'
import './RegisterPage.css'  
import loginPlane from '../../assets/loginPlane.svg'

export default function RegisterPage() {

    return (
        <div id="registerPage">
            <div className="promptContainer">
                <div className='promptContainerImg' id='promptContainerImgRegister'>
                    <img src={loginPlane} alt="" />
                    <h2>Welcome aboard</h2>
                    <p>just a couple of clicks and we start our journey</p>
                </div>
                <div className='prompt'>
                    <h1>Hello, register bellow!</h1>
                    <form>
                        <input type='email'
                            placeholder="Email"
                            name="email" />
                        <input type="password"
                            placeholder="Password"
                            name="password" />
                        <input type="submit" value="Register" className='submitButton' id='registerButton'/>
                    </form>
                </div>
            </div>
        </div>
    )
}