import { Route, Routes } from "react-router-dom";
import "./App.css";
import FormPage from "./pages/form/FormPage";
import SimulationPage from "./pages/simulation/SimulationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/simulation" element={<SimulationPage />} />
    </Routes>
  );
}

export default App;
