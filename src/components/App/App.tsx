import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Input from "../InputPage/Input";
import Result from "../ResultPage/ResultPage";
import LandingPage from "../LandingPage/LandingPage";
import Navbar from "../Navbar/Navbar";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserPage from "../UserPage/UserPage";
import Directions from "../Directions/Directions";
import APIClient from "../../api/client";

export const AuthenticatedUserContext = createContext<any>(null);

function App() {
  const hideNavbar = location.pathname === '/routeDirections';
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function cookieLogin() {
      const apiClient = new APIClient();
      const response = await apiClient.get('/user/authenticate', '', {});
      if (response.ok) {
        const userObject = response.body;
        setIsAuthenticated(userObject);
        console.log('test',isAuthenticated, userObject)
      }

    }
    cookieLogin();
  }, [isAuthenticated]);

  return (
    <div className="app">
      <AuthenticatedUserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <BrowserRouter>
          {!hideNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/prompt" element={<Input />} />
            <Route path="/result" element={<Result />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/userpage" element={<UserPage />} /> */}
            <Route path="/routeDirections" element={<Directions />} />
            { (isAuthenticated) ? <Route path="/userpage" element={<UserPage />} /> : null }
          </Routes>
        </BrowserRouter>
      </AuthenticatedUserContext.Provider>
    </div>
  )
}

export default App
