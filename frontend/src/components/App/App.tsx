import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Result from "../ResultPage/ResultPage";
import LandingPage from "../LandingPage/LandingPage";
import Navbar from "../Navbar/Navbar";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserPage from "../UserPage/UserPage";
import Directions from "../Directions/Directions";
import APIClient from "../../api/client";
import LoadingPage from "../LoadingPage/LoadingPage";
import InputPage from "../InputPage/InputPage";

export const AuthenticatedUserContext = createContext<any>(null);
export const LoadingContext = createContext<any>(null);

function App() {
  const hideNavbar = location.pathname === '/routeDirections';
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function cookieLogin() {
      const apiClient = new APIClient();
      const response = await apiClient.get('/user/authenticate', '', {});
      if (response.ok) {
        const userObject = response.body;
        setIsAuthenticated(userObject);
      }

    }
    cookieLogin();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="app">
      <AuthenticatedUserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
          <BrowserRouter>
            {!hideNavbar && <Navbar />}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/prompt" element={<InputPage />} />
              <Route path="/result" element={<Result />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* <Route path="/userpage" element={<UserPage />} /> */}
              <Route path="/routeDirections" element={<Directions />} />
              {(isAuthenticated) ? <Route path="/userpage" element={<UserPage />} /> : null}
            </Routes>
          </BrowserRouter>
        </LoadingContext.Provider>
      </AuthenticatedUserContext.Provider>
    </div>
  )
}

export default App
