import { useEffect, useContext, useState, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { context } from "../context";
import ImgGrid from "./ImgGrid";
import { getProfileByUsername, removeProfilePicture } from "../api/profile";
import { useNavigate } from "react-router-dom";
import ShowProfilePic from "./ShowProfilePic";
import ProfileImageEditor from "./ProfileImageEditor";

const Profile = () => {
  /**
   * User can customize their profile.
   */
  const globalVal = useContext(context);
  const navigator = useNavigate();
  let isDirect = false; // for changing profile picture directly by clicking on profile picture.

  let initWidth = useRef(0);
  let initHeight = useRef(0);
  let translateX = useRef(0);
  let translateY = useRef(0);
  let initMousePosX = useRef(0);
  let initMousePosY = useRef(0);
  let zoomVal = useRef(0);
  let posX = useRef(0),
    posY = useRef(0);

  const [userInfo, setUserInfo] = useState({});
  const [isOwn, setIsOwn] = useState(false);
  const [openImageOpt, setOpenImageOpt] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [zoomRangeVal, setZoomRangeVal] = useState(0);
  const [showPictureEditor, setShowImageEditor] = useState(false);
  let [pictureFile, setPictureFile] = useState({});
  const { username } = useParams();

  const imageCropOuter = useRef();
  const imageCropContainer = useRef();
  const imageCropPreview = useRef();
  const imageZoomRange = useRef();

  const getUserInfo = () => {
    (async () => {
      const data = await getProfileByUsername(username);
      if (data.success) {
        setUserInfo(data);
      }
    })();
  };

  const handleRemoveImage = async () => {
    const data = await removeProfilePicture(
      localStorage.getItem("access_token")
    );
  };

  useEffect(() => {
    if (userInfo.user_name === globalVal.username) {
      setIsOwn(true);
    } else {
      setIsOwn(false);
    }
  }, [globalVal.username, userInfo]);

  useMemo(() => {
    getUserInfo();
  }, [username]);

  useEffect(() => {
    globalVal.setShowBall(false);
  }, []);

  return (
    <>
      <div></div>
      <div className="flex flex-col">
        <ShowProfilePic />
        <div>
          <div className="w-full h-52 xl:h-96">
            <img
              src="/images/recommended11.jpg"
              alt="user banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center px-0 md:px-14 lg:px-24 xl:px-60 gap-2 sm:gap-10 relative py-10">
            <div className="w-max">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-profile-img shadow-slate-600">
                <img
                  src={userInfo.user_picture || "/images/default_profile.jpeg"}
                  alt={userInfo.name}
                  className="w-full h-full object-cover"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isOwn) {
                      setOpenImageOpt(true);
                    } else {
                      if (
                        !e.target.src.includes("/images/default_profile.jpeg")
                      ) {
                        globalVal.setImageUrlAndPos({
                          url: userInfo.user_picture,
                          pos: e.target.getBoundingClientRect(),
                        });
                      }
                    }
                  }}
                  onError={(e) =>
                    (e.target.src = "/images/default_profile.jpeg")
                  }
                />
              </div>
            </div>
            <div className="py-1 sm:py-4 w-full relative flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-3 md:gap-10 items-center">
                <p className="font-bold text-2xl sm:text-4xl">
                  {userInfo.name}
                </p>
                <div className="flex gap-3">
                  {!isOwn ? (
                    <>
                      <div onClick={() => setIsFollowed(!isFollowed)}>
                        {isFollowed ? (
                          <p className="text-base flex items-center font-extrabold bg-slate-200 text-stone-900 p-2 rounded-2xl cursor-pointer w-max mt-2 sm:mt-0 m-auto md:m-0">
                            Unfollow{" "}
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 640 512"
                                className="w-5 ml-1"
                              >
                                <defs>
                                  <linearGradient
                                    id="my-gradient1"
                                    gradientTransform="rotate(45)"
                                  >
                                    <stop offset="0%" stopColor="#00A1AB" />
                                    <stop offset="100%" stopColor="#020112" />
                                  </linearGradient>
                                </defs>
                                <path
                                  fill="url(#my-gradient1)"
                                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM472 200H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H472c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                                />
                              </svg>
                            </span>
                          </p>
                        ) : (
                          <p className="text-base flex items-center font-extrabold bg-slate-200 text-stone-900 p-2 rounded-2xl cursor-pointer w-max mt-2 sm:mt-0 m-auto md:m-0">
                            Follow{" "}
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 640 512"
                                className="w-5 ml-1"
                              >
                                <defs>
                                  <linearGradient
                                    id="my-gradient2"
                                    gradientTransform="rotate(45)"
                                  >
                                    <stop offset="0%" stopColor="#00A1AB" />
                                    <stop offset="100%" stopColor="#020112" />
                                  </linearGradient>
                                </defs>
                                <path
                                  fill="url(#my-gradient2)"
                                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                                />
                              </svg>
                            </span>
                          </p>
                        )}
                      </div>
                      <p className="text-base flex items-center font-extrabold bg-slate-200 text-stone-900 p-2 rounded-2xl cursor-pointer w-max mt-2 sm:mt-0 m-auto md:m-0">
                        Donate{" "}
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 640 512"
                            className="w-5 ml-1"
                          >
                            <defs>
                              <linearGradient
                                id="my-gradient2"
                                gradientTransform="rotate(45)"
                              >
                                <stop offset="0%" stopColor="#00A1AB" />
                                <stop offset="100%" stopColor="#020112" />
                              </linearGradient>
                            </defs>
                            <path
                              fill="url(#my-gradient2)"
                              d="M312 24V34.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3 0 0c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8V232c0 13.3-10.7 24-24 24s-24-10.7-24-24V220.6c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2V24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5H192 32c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32H68.8l44.9-36c22.7-18.2 50.9-28 80-28H272h16 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H288 272c-8.8 0-16 7.2-16 16s7.2 16 16 16H392.6l119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384l0 0-.9 0c.3 0 .6 0 .9 0z"
                            />
                          </svg>
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-base flex items-center font-extrabold bg-slate-200 text-stone-900 p-2 rounded-2xl cursor-pointer w-max mt-2 sm:mt-0 m-auto md:m-0">
                      Edit{" "}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 640 512"
                          className="w-5 ml-1"
                        >
                          <defs>
                            <linearGradient
                              id="my-gradient3"
                              gradientTransform="rotate(45)"
                            >
                              <stop offset="0%" stopColor="#171C2D" />
                              <stop offset="100%" stopColor="#254252" />
                            </linearGradient>
                          </defs>
                          <path
                            fill="url(#my-gradient3)"
                            d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H322.8c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1H178.3zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z"
                          />
                        </svg>
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="user-bio sm:w-96 m-auto md:m-0">
                  {userInfo.user_bio ? userInfo.user_bio : ""}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                <div className="text-base follow-text flex gap-2 sm:gap-5 justify-center md:justify-normal items-center border-t border-b md:border-none border-stone-100 py-2 md:py-0">
                  <span>
                    Followers : <span className="font-bold">10000</span>
                  </span>
                  <span className="ml-5">
                    Following : <span className="font-bold">10000</span>
                  </span>
                  <span className="ml-5">
                    Photos : <span className="font-bold">256</span>
                  </span>
                </div>
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
      {openImageOpt && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-slate-900 text-slate-200 flex flex-col text-center rounded-xl overflow-hidden">
            <p
              className="px-14 py-6 cursor-pointer font-bold text-blue-500 hover:bg-stone-800 transition-colors duration-200"
              onClick={() => document.querySelector("#new-picture").click()}
            >
              New Photo
              <input
                type="file"
                name="new-picture"
                id="new-picture"
                accept="image/*"
                aria-hidden
                hidden
                onChange={(e) => {
                  e.preventDefault;
                  setPictureFile(e.target.files[0]);
                  // imageCropPreview.current.removeAttribute("style");
                  // imageCropPreview.current.src = (
                  //   URL || webkitURL
                  // ).createObjectURL(e.target.files[0]);
                  // imageCropOuter.current.style.display = "grid";
                  setShowImageEditor(true);
                }}
              />
            </p>
            {userInfo.user_picture && (
              <p
                className="px-14 py-6 cursor-pointer font-bold text-red-500 hover:bg-stone-800 transition-colors duration-200"
                onClick={handleRemoveImage}
              >
                Remove Photo
              </p>
            )}
            <p
              className="px-14 py-6 cursor-pointer font-bold hover:bg-stone-800 transition-colors duration-200"
              onClick={() => setOpenImageOpt(false)}
            >
              Cancel
            </p>
          </div>
          {showPictureEditor && (
            <ProfileImageEditor
              setShowImageEditor={setShowImageEditor}
              pictureFile={pictureFile}
            />
          )}

          {/* <div className="image-crop-outer" ref={imageCropOuter}>
            <div className="image-crop-container">
              <div className="action-btn">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="cancel icons"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  ></path>
                </svg>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="done icons"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
              <div
                className="img-crop"
                ref={imageCropContainer}
                onMouseDown={(e) => {
                  (initMousePosX.current = e.clientX),
                    (initMousePosY.current = e.clientY);
                }}
                onMouseUp={() => {
                  (initMousePosX.current = 0), (initMousePosY.current = 0);
                }}
                onMouseMove={(e) => {
                  if ((initMousePosX.current, initMousePosY.current)) {
                    const x = Math.round(
                      (initMousePosX.current - e.clientX) / 20
                    );
                    const y = Math.round(
                      (initMousePosY.current - e.clientY) / 20
                    );

                    if (
                      posX.current - x >=
                        translateX.current - Math.round(zoomVal.current / 2) &&
                      posX.current - x <=
                        -translateX.current + Math.round(zoomVal.current / 2)
                    ) {
                      posX.current -= x;
                    }

                    if (
                      posY.current - y >=
                        translateY.current - Math.round(zoomVal.current / 2) &&
                      posY.current - y <=
                        -translateY.current + Math.round(zoomVal.current / 2)
                    ) {
                      posY.current -= y;
                    }

                    imageCropPreview.current.style.transform = `translate3d(${
                      translateX.current +
                      posX.current -
                      Math.round(zoomVal.current / 2)
                    }px, ${
                      translateY.current +
                      posY.current -
                      Math.round(zoomVal.current / 2)
                    }px, 0)`;
                  }
                }}
              >
                <div className="extra-circle"></div>
                <img
                  alt="image"
                  className="img no-tailwind"
                  draggable="false"
                  ref={imageCropPreview}
                  onLoad={(e) => {
                    if (
                      imageCropPreview.current.width >
                      imageCropPreview.current.height
                    ) {
                      initHeight.current =
                        imageCropContainer.current.clientHeight;
                      imageCropPreview.current.style.height = `${initHeight.current}px`;
                      imageCropPreview.current.style.transform = `translate3d(${
                        (imageCropPreview.current.width -
                          imageCropContainer.current.clientWidth) /
                        -2
                      }px, ${
                        (imageCropPreview.current.height -
                          imageCropContainer.current.clientHeight) /
                        -2
                      }px, 0)`;
                      (translateX.current =
                        (imageCropPreview.current.width -
                          imageCropContainer.current.clientWidth) /
                        -2),
                        (translateY.current =
                          (imageCropPreview.current.height -
                            imageCropContainer.current.clientHeight) /
                          -2);
                    } else {
                      initWidth.current =
                        imageCropContainer.current.clientWidth;
                      imageCropPreview.current.style.width = `${initWidth.current}px`;
                      imageCropPreview.current.style.transform = `translate3d(${
                        (imageCropPreview.current.width -
                          imageCropContainer.current.clientWidth) /
                        -2
                      }px, ${
                        (imageCropPreview.current.height -
                          imageCropContainer.current.clientHeight) /
                        -2
                      }px, 0)`;
                      (translateX.current =
                        (imageCropPreview.current.width -
                          imageCropContainer.current.clientWidth) /
                        -2),
                        (translateY.current =
                          (imageCropPreview.current.height -
                            imageCropContainer.current.clientHeight) /
                          -2);
                    }
                  }}
                />
              </div>
              <div className="controls">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="icons"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                  ></path>
                </svg>
                <input
                  type="range"
                  name="zoom"
                  value={zoomRangeVal}
                  id="zoom"
                  step="1"
                  max="100"
                  ref={imageZoomRange}
                  onInput={(e) => {
                    if (zoomVal.current > parseInt(e.target.value)) {
                      if (
                        posX.current -
                          (zoomVal.current - parseInt(e.target.value)) >=
                        0
                      ) {
                        posX.current -=
                          zoomVal.current - parseInt(e.target.value);
                      } else if (
                        posX.current +
                          (zoomVal.current - parseInt(e.target.value)) <=
                        0
                      ) {
                        posX.current +=
                          zoomVal.current - parseInt(e.target.value);
                      } else {
                        posX.current = 0;
                      }

                      if (
                        posY.current -
                          (zoomVal.current - parseInt(e.target.value)) >=
                        0
                      ) {
                        posY.current -=
                          zoomVal.current - parseInt(e.target.value);
                      } else if (
                        posY.current +
                          (zoomVal.current - parseInt(e.target.value)) <=
                        0
                      ) {
                        posY.current +=
                          zoomVal.current - parseInt(e.target.value);
                      } else {
                        posY.current = 0;
                      }
                    }

                    zoomVal.current = parseInt(e.target.value);
                    setZoomRangeVal(e.target.value);

                    if (initWidth.current) {
                      imageCropPreview.current.style.width = `${
                        initWidth.current + zoomVal.current
                      }px`;
                    } else {
                      imageCropPreview.current.style.height = `${
                        initHeight.current + zoomVal.current
                      }px`;
                    }

                    imageCropPreview.current.style.transform = `translate3d(${
                      translateX.current +
                      posX.current -
                      Math.round(zoomVal.current / 2)
                    }px, ${
                      translateY.current +
                      posY.current -
                      Math.round(zoomVal.current / 2)
                    }px, 0`;
                    e.target.value = `${zoomVal.current}`;
                  }}
                />
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="icons"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                  ></path>
                </svg>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default Profile;
