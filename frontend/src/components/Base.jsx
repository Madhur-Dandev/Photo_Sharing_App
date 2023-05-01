import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Base = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <BottomNav />
    </>
  );
};

export default Base;
