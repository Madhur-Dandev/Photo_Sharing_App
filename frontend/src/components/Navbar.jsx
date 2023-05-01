import { Link } from "react-router-dom";
import { context } from "../context";
import { useContext, useRef, useState, useEffect } from "react";

const Navbar = () => {
  const globalVal = useContext(context);

  const hamMenu = useRef();
  const ball = useRef();

  useEffect(() => {
    if (globalVal.ballPos === 2) {
      ball.current.classList.remove("-left-1.5");
      ball.current.classList.add("left-nav-middle");
      ball.current.classList.remove("left-nav-end");
    } else if (globalVal.ballPos === 3) {
      ball.current.classList.remove("-left-1.5");
      ball.current.classList.remove("left-nav-middle");
      ball.current.classList.add("left-nav-end");
    } else {
      ball.current.classList.add("-left-1.5");
      ball.current.classList.remove("left-nav-middle");
      ball.current.classList.remove("left-nav-end");
    }
  }, [globalVal.ballPos]);

  // const handleShowSidebar = () => {
  //   console.log("hi");
  //   if (!globalVal.showSidebar) {
  //     globalVal.setShowSidebar(true);
  //     hamMenu.current.children[2].classList.add("w-0");
  //     hamMenu.current.children[1].classList.add("w-8");
  //     hamMenu.current.children[0].classList.add("w-0");
  //   } else {
  //     globalVal.setShowSidebar(false);
  //     hamMenu.current.children[2].classList.remove("w-0");
  //     hamMenu.current.children[1].classList.remove("w-8");
  //     hamMenu.current.children[0].classList.remove("w-0");
  //   }
  //   console.log();
  // };

  return (
    <nav className="bg-slate-800 py-3 px-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="logo" className="w-10 rounded-full" />
        <p className="font-extrabold text-xl text-slate-200 font-logoFont">
          UShare
        </p>
      </div>
      <div className="relative sm:block hidden">
        <div
          className="absolute -top-initial -left-1.5 w-9 h-9 bg-gray-500 rounded-full transition-all duration-200"
          ref={ball}
        ></div>
        <ul className="flex items-center gap-10 z-10 relative">
          <li>
            <Link to="/" onClick={() => globalVal.setBallPos(1)}>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="nav-list-icon"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
              </svg>
            </Link>
          </li>
          <li>
            <Link to="/gallery" onClick={() => globalVal.setBallPos(2)}>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="nav-list-icon"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                ></path>
              </svg>
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => globalVal.setBallPos(3)}>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="nav-list-icon"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                ></path>
              </svg>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <a
          href="/login"
          className="px-4 py-2 text-lg rounded-md text-slate-200 font-bold bg-sky-800 shadow-nav-login shadow-slate-200 hover:bg-sky-700 hover:text-slate-100 hover:shadow-nav-login-hover hover:shadow-slate-200  transition-all duration-600"
        >
          Login
        </a>
      </div>
      {/* <div
        className="flex flex-col gap-1 cursor-pointer absolute right-4 -rotate-180 z-50"
        ref={hamMenu}
        onClick={() => handleShowSidebar()}
      >
        <div className="h-1 w-4 bg-black transition-all duration-500"></div>
        <div className="h-1 w-6 bg-black transition-all duration-500"></div>
        <div className="h-1 w-8 bg-black transition-all duration-500"></div>
      </div> */}
    </nav>
  );
};

export default Navbar;
