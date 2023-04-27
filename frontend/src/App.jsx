// import "./App.css";
import { useContext } from "react";
import { context } from "./context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Base from "./components/Base";
import Home from "./components/Home";

function App() {
  const globalVal = useContext(context);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Base />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Home />} />
          <Route path="about" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
