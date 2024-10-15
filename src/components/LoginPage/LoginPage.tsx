import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedUserContext, LoadingContext } from '../App/App';
import '../InputPage/InputPage.css'
import './LoginPage.css'
import APIClient from '../../api/client';
import loginPlane from '../../assets/loginPlane.svg'

interface ApiResponse {
    ok: boolean;
    status: number;
    body: {
        data?: object;
        error?: {
            message: string;
            status: number;
        };
    };
}

interface Errors {
    prompt?: string;
    // Add other error properties if needed
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthenticatedUserContext);
    const { setIsLoading } = useContext(LoadingContext);
    const [errors, setErrors] = useState<Errors>({});
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const handleInput = (e: { target: { name: string; value: string } }) => {
        if (e.target.name === "email") {
            if (e.target.value.indexOf("@") === -1) {
                setErrors((e) => ({ ...e, email: "Please enter a valid email." }));
            } else {
                setErrors((e) => ({ ...e, email: null }));
            }
        }
        const { name, value } = e.target;
        setInput((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    async function postAPICall(info: object): Promise<ApiResponse> {
        const apiClient = new APIClient();
        const userRoute = "/user/login";
        const response = await apiClient.post(userRoute, info, {});
        return response;
    }

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.email === "" || input.password === "") {
            setErrors((e) => ({ ...e, prompt: "Fill all sections" }));
            return;
        } else {
            setErrors((e) => ({ ...e, prompt: "" }));
        }

        try {
            setIsLoading(true);
            const res = await postAPICall(input);

            if (res?.status === 200) {
                setIsLoading(false);
                setIsAuthenticated(res.body);
                navigate("/userpage", { state: { response: res.body } });
            } else {
                setIsLoading(false);
                setErrors((e) => ({
                    ...e,
                    prompt: res.body.error?.message,
                }));
            }
        } catch (err) {
            setIsLoading(false);
            setErrors((e) => ({
                ...e,
                prompt: String(err),
            }));
        }
    };


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
                            name="email"
                            onChange={handleInput} />
                        <input type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleInput} />
                        <input type="submit" value="Login" className='submitButton' id='loginButton' onClick={loginUser} />
                    </form>
                </div>
            </div>
        </div>
    )
}