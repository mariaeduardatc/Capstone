import '../InputPage/InputPage.css'
import './RegisterPage.css'
import loginPlane from '../../assets/loginPlane.svg'
import { useState } from 'react'
import APIClient from '../../api/client';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [input, setInput] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    interface ApiResponse{
        ok: boolean;
        status: number;
        body: {
          data?: object;
          error?: {
            message: string;
            status: number;
          }
        }
      }

    const handleInput = (e: {target: {name: string, value:string}}) => {
        const { name, value } = e.target;
        console.log('handleInput', name, value)
        setInput((prevUser) => ({
            ...prevUser,
            [name]: value,
          }));
    }

    async function postAPICall(info: object) : Promise<ApiResponse>{
      console.log('postAPIcall')
        const apiClient = new APIClient();
        const userRoute = '/user/register';
        const response = await apiClient.post(userRoute, info, {});
        return response;
      }
  
      const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('inside registerUser', input)
          if (
            input.firstName === "" ||
            input.lastName== "" ||
            input.email == "" ||
            input.password == "" ||
            input.confirmPassword == ""
            
          ) {
            console.log('err1')
            setErrors((e) => ({ ...e, prompt: "Fill all sections" }));
            // setIsLoading(false);
            return;
          } else if(input.password != input.confirmPassword) {
            console.log('err2')
            setErrors((e) => ({ ...e, prompt: "Passwords do not match" }));
            // setIsLoading(false);
            return;
          }
           else {
            console.log('err3')
            setErrors((e) => ({ ...e, prompt: ""}));
          }
      
          try {
            // setIsLoading(true);
            console.log('inside try response input')
            const responseInput = {
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              password: input.password,
            }

            const res = await postAPICall(responseInput);
            console.log('API Response:', res);
            
          if (res?.status === 200 ) {
            //   setIsLoading(false);
            //   setIsAuthenticated(res.body);
            console.log('inside success')
              // navigate("/");
            } else {
              setErrors((e) => ({
                ...e,
                prompt: res.body.error?.message,
              }));
            //   setIsLoading(false);
            }
          } catch (err) {
            console.log(err);
            setErrors((e) => ({
              ...e,
              prompt: String(err),
            }));
            // setIsLoading(false);
          }
        };

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
                        <input type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={input.firstName}
                            onChange={handleInput} />
                        <input type="text"
                            placeholder="Last Name"
                            name="lastName"
                            value={input.lastName}
                            onChange={handleInput} />
                        <input type='email'
                            placeholder="Email"
                            name="email" 
                            value={input.email}
                            onChange={handleInput} />
                        <input type="password"
                            placeholder="Password"
                            name="password" 
                            value={input.password}
                            onChange={handleInput} />
                        <input name='confirmPassword'
                            type="password"
                            placeholder='Confirm Password'
                            value={input.confirmPassword}
                            onChange={handleInput} />
                        <input type="submit" value="Register" className='submitButton' id='registerButton' onClick={registerUser}/>
                    </form>
                </div>
            </div>
        </div>
    )
}