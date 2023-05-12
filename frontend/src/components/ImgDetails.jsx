import { useContext } from "react";
import { context } from "../context";
import rImg1 from "/images/recommended1.jpg";

const ImgDetails = () => {
  const globalVal = useContext(context);

  const info = {
    id: 1,
    user_name: "Madhur Dandev",
    user_avatar:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OyfD4XonoalTInNN_EU19QHaHa%26pid%3DApi&f=1&ipt=cfaa12adff3349daa78a4e46287bcabb40e96ef8034b139204c169f5f2596d78&ipo=images",
    img: rImg1,
  };

  return (
    !globalVal.showImgDetails && (
      <div className="fixed top-0 left-0 w-full h-screen z-50 backdrop-blur-lg p-3 bg-gray-900 bg-opacity-60 overflow-scroll">
        <div className="flex justify-between items-center overflow-y-scroll">
          <div className="flex items-center gap-3">
            <img
              src={info.user_avatar}
              alt={info.user_name}
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            <p className="font-bold text-sm sm:text-base">{info.user_name}</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <p className="flex items-center bg-slate-700 px-4 py-2 rounded-md gap-2 font-bold cursor-pointer">
              <span className="hidden sm:block">Follow</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-6 sm:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              </span>
            </p>
            <p className="flex items-center bg-slate-100 text-slate-700 px-4 py-2 rounded-md gap-2 font-bold cursor-pointer">
              <span className="hidden sm:block">Donate</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-6 sm:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div>
            <img
              src={info.img}
              alt="image"
              className="w-full h-screen object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1">
                <span>Like</span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </span>
              </p>
              <p className="flex items-center gap-1">
                <span>Save</span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ImgDetails;
