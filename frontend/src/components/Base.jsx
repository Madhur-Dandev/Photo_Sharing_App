import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Base = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Base;
