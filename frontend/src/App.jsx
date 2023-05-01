// import "./App.css";
import { useContext } from "react";
import { context } from "./context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Base from "./components/Base";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import About from "./components/About";

function App() {
  const globalVal = useContext(context);

  return (
    <div className="bg-slate-600 text-slate-100">
      <Router>
        <Routes>
          <Route path="/" element={<Base />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
