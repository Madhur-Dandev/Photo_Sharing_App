import { useEffect } from "react";
import ImgGrid from "./ImgGrid";

const Profile = () => {
  useEffect(() => {
    globalVal.setShowBall(false);
  }, []);

  return (
    <div className="flex flex-col">
      <div>
        <div className="w-full h-56 xl:h-96">
          <img
            src="/images/recommended11.jpg"
            alt="user banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center px-2 md:px-32 lg:px-44 xl:px-60 gap-2 sm:gap-10 relative -top-6 sm:-top-11 profile-info-div">
          <div className="w-max">
            <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden">
              <img
                src="/images/profile_temp.jpeg"
                alt="user picture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="py-1 sm:py-4 w-full relative top-1 sm:top-0 text-center sm:text-start">
            <p className="font-bold text-lg sm:text-2xl profile-name">
              Madhuri Kusumshastri
            </p>
            <div className="flex flex-col lg:flex-row justify-between lg:items-center">
              <div className="text-xs sm:text-sm follow-text">
                <span>
                  Followers : <span>10000</span>
                </span>
                <span className="ml-5">
                  Following : <span>10000</span>
                </span>
              </div>
              <p className="text-xs lg:text-base flex items-center font-bold bg-slate-900 p-1 lg:p-2 rounded-2xl cursor-pointer w-max mt-2 lg:mt-0 m-auto sm:m-0">
                Follow{" "}
                <span>
                  {/* className="w-3 lg:w-5 ml-1" */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-3 lg:w-5 ml-1"
                  >
                    <defs>
                      <linearGradient
                        id="my-gradient"
                        gradientTransform="rotate(45)"
                      >
                        <stop offset="0%" stopColor="cyan" />s
                        <stop offset="50%" stopColor="magenta" />
                        <stop offset="100%" stopColor="yellow" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#my-gradient)"
                      d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"
                    ></path>
                  </svg>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-center mb-2 sm:mb-10 sm:text-4xl text-3xl mt-5 sm:mt-0 font-bold">
          Uploaded Photos
        </p>
        <ImgGrid />
      </div>
    </div>
  );
};

export default Profile;
