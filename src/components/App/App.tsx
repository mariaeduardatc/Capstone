import { BrowserRouter, Route, Routes } from "react-router-dom";
import Input from "../InputPage/Input";
import Result from "../ResultPage/ResultPage";
import LandingPage from "../LandingPage/LandingPage";
import Navbar from "../Navbar/Navbar";

function App() {
  return(
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/prompt" element={<Input/>}/>
          <Route path="/result" element={<Result/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
