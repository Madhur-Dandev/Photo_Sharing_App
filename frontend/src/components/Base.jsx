import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

const Base = () => {
  /**
   * This is starting point of all page.
   * The <Outlet /> tag is the page that'll be render for certain link.
   * <Navbar /> <BottomNav /> <Footer /> is global across the page that uses this component.
   */

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
