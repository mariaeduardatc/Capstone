import { BrowserRouter, Route, Routes } from "react-router-dom";
import Input from "../InputPage/Input";
import Result from "../ResultPage/ResultPage";

function App() {
  return(
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Input/>}/>
          <Route path="/result" element={<Result/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
