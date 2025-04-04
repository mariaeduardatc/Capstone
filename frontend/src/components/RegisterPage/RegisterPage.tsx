import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthenticatedUserContext, LoadingContext } from '../App/App';
import '../InputPage/InputPage.css'
import './RegisterPage.css'
import loginPlane from '../../assets/loginPlane.svg'
import APIClient from '../../api/client';
import { ApiResponse, Errors } from '../../types/types';
import { toast, ToastContainer } from 'react-toastify';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthenticatedUserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const [error, setError] = useState<Errors>();
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInput = (e: { target: { name: string, value: string } }) => {
    const { name, value } = e.target;
    setInput((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  async function postAPICall(info: object): Promise<ApiResponse> {
    const apiClient = new APIClient();
    const userRoute = '/user/register';
    const response = await apiClient.post(userRoute, info, {});
    return response;
  }

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      input.firstName === "" ||
      input.lastName == "" ||
      input.email == "" ||
      input.password == "" ||
      input.confirmPassword == ""

    ) {
      toast.error("Fill all sections");
      setIsLoading(false);
      return;
    } else if (input.password != input.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    else {
      setError((e) => ({ ...e, prompt: "" }));
      toast.error("An error has occurred");
    }

    try {
      setIsLoading(true);
      const responseInput = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
      }

      const res = await postAPICall(responseInput);
      // test
      if (res?.status === 200) {
        setIsLoading(false);
        setIsAuthenticated(res.body);
        navigate("/userpage");
      } else {
        setError((e) => ({
          ...e,
          prompt: res.body.error?.message,
        }));
        console.log(error);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("An error has occurred");
      console.log(err);
      setError((e) => ({
        ...e,
        prompt: String(err),
      }));
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={6000} hideProgressBar={false} />
      <div id="registerPage">
        <div className="promptContainer">
          <div className='promptContainerImg' id='promptContainerImgRegister'>
            <img src={loginPlane} alt="blue plane with blue finger digital on the background" />
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
              <input type="submit" value="Register" className='submitButton' id='registerButton' onClick={registerUser} />
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
