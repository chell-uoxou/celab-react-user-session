import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NameAndIdPage from "./pages/NameAndIdPage";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/examples/name_and_id" element={<NameAndIdPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
