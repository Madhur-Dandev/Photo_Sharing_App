import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

const Base = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <BottomNav />
      <Footer />
    </>
  );
};

export default Base;
