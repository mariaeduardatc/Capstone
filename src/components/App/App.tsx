import { BrowserRouter, Route, Routes } from "react-router-dom";
import Input from "../InputPage/Input";
import Result from "../ResultPage/ResultPage";
import LandingPage from "../LandingPage/LandingPage";
import Navbar from "../Navbar/Navbar";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserPage from "../UserPage/UserPage";

function App() {
  return(
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/prompt" element={<Input/>}/>
          <Route path="/result" element={<Result/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/userpage" element={<UserPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
