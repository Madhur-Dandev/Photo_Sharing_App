import { useRef, useState, useEffect } from "react";

const ProfileImageEditor = ({ setShowImageEditor, pictureFile }) => {
  let initWidth = useRef(0);
  let initHeight = useRef(0);
  let translateX = useRef(0);
  let translateY = useRef(0);
  let initMousePosX = useRef(0);
  let initMousePosY = useRef(0);
  let zoomVal = useRef(0);
  let posX = useRef(0),
    posY = useRef(0);

  const imageCropPreview = useRef();
  const imageCropContainer = useRef();

  const [zoomRangeVal, setZoomRangeVal] = useState(0);

  const handleChangeProfilePicture = async () => {
    console.log({
      file: {},
      translateX:
        translateX.current + posX.current - Math.round(zoomVal.current / 2),
      translateY:
        translateY.current + posY.current - Math.round(zoomVal.current / 2),
      width: imageCropPreview.current.width,
      height: imageCropPreview.current.height,
    });
  };

  useEffect(() => {
    if (imageCropPreview.current) {
      imageCropPreview.current.src = (URL || webkitURL).createObjectURL(
        pictureFile
      );
    }
  }, []);

  return (
    <div className="image-crop-outer">
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
            onClick={() => setShowImageEditor(false)}
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
            onClick={handleChangeProfilePicture}
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
              const x = Math.round((initMousePosX.current - e.clientX) / 20);
              const y = Math.round((initMousePosY.current - e.clientY) / 20);

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
                imageCropPreview.current.width > imageCropPreview.current.height
              ) {
                initHeight.current = imageCropContainer.current.clientHeight;
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
                initWidth.current = imageCropContainer.current.clientWidth;
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
            onInput={(e) => {
              if (zoomVal.current > parseInt(e.target.value)) {
                if (
                  posX.current - (zoomVal.current - parseInt(e.target.value)) >=
                  0
                ) {
                  posX.current -= zoomVal.current - parseInt(e.target.value);
                } else if (
                  posX.current + (zoomVal.current - parseInt(e.target.value)) <=
                  0
                ) {
                  posX.current += zoomVal.current - parseInt(e.target.value);
                } else {
                  posX.current = 0;
                }

                if (
                  posY.current - (zoomVal.current - parseInt(e.target.value)) >=
                  0
                ) {
                  posY.current -= zoomVal.current - parseInt(e.target.value);
                } else if (
                  posY.current + (zoomVal.current - parseInt(e.target.value)) <=
                  0
                ) {
                  posY.current += zoomVal.current - parseInt(e.target.value);
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
    </div>
  );
};

export default ProfileImageEditor;
