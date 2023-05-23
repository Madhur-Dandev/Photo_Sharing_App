import { useContext } from "react";
import { context } from "./context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./components/Base";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Login from "./components/Login";
import AuthFormBase from "./components/AuthFormBase";
import Profile from "./components/Profile";
import ImgDetails from "./components/ImgDetails";
import UploadForm from "./components/UploadForm";
import Alert from "./components/Alert";

function App() {
  const globalVal = useContext(context); // access global context values

  return (
    <div className="bg-slate-600 text-slate-100 relative">
      {/* show alert only when something triggers it. */}
      {globalVal.showAlert && <Alert />}
      {/* Component to show the details of image when it shows to user */}
      {globalVal.showImgDetails && <ImgDetails />}
      <Router>
        <Routes>
          <Route path="/" element={<Base />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
            <Route path="upload" element={<UploadForm />} />
          </Route>
          {/* <Route path="login" element={<Login />} /> */}
          <Route path="auth/:type" element={<AuthFormBase />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
