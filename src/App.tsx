import { BrowserRouter, Route, Routes } from "react-router-dom";
import Input from "./Input";
import Result from "./Result";

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
