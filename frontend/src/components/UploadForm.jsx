import { useRef, useContext, useState, useEffect } from "react";
import { context } from "../context";

const UploadForm = () => {
  const globalVal = useContext(context);
  const [image, setImage] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const file = useRef();
  const dropContainer = useRef();
  const previewContainer = useRef();

  console.log(image);

  const triggerAlert = (msg) => {
    console.log(msg);
    globalVal.setAlertMsg(msg);
    globalVal.setShowAlert(false);
    setTimeout(() => {
      globalVal.setShowAlert(true);
    }, 1);
  };

  const setUploadImage = (files) => {
    if (files[0].type.includes("image")) {
      if (files.length > 1) {
        triggerAlert("Cannot upload more than 1 file.");
      }
      setImage(files[0]);
      setShowPreview(true);
      dropContainer.current.classList.add("border-green-400");
    } else {
      triggerAlert("File must be image");
    }
    dropContainer.current.classList.remove("border-red-400");
  };

  useEffect(() => {
    if (showPreview) {
      const previewImg = document.createElement("img");
      previewImg.src = (window.URL ? URL : webkitURL).createObjectURL(image);
      previewImg.className = "w-full h-full object-contain";
      previewContainer.current.append(previewImg);
    }
  }, [showPreview]);

  return (
    <div className="grid place-items-center">
      <div className="w-11/12 sm:w-3/4 sm:mx-auto h-screen">
        <h1 className="text-center text-2xl sm:text-4xl m-3 font-bold">
          Upload Your Photo
        </h1>
        <div className="h-4/5 w-full">
          <div
            className="w-full h-full flex flex-col justify-center items-center border-2 border-red-50 border-dashed relative transition-colors duration-300"
            onClick={(e) => {
              if (!showPreview) file.current.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.target.classList.add("border-red-400");
            }}
            onDragLeave={(e) => {
              e.target.classList.remove("border-red-400");
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (!showPreview) setUploadImage(e.dataTransfer.files);
              else triggerAlert("Please remove the image first");
            }}
            ref={dropContainer}
          >
            {!showPreview ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 sm:w-36 h-16 sm:h-36"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
                <input
                  type="file"
                  name="upload-image"
                  id="upload-image"
                  hidden
                  ref={file}
                  onChange={(e) => {
                    setUploadImage(e.target.files);
                  }}
                />
                <h2 className="text-sm sm:text-base">
                  Drag the file here or click on camera
                </h2>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 my-4 mx-2 cursor-pointer absolute -top-12 -left-3 z-20"
                  onClick={() => {
                    setImage({});
                    setShowPreview(false);
                    dropContainer.current.classList.remove("border-green-400");
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div
                  ref={previewContainer}
                  className="relative w-full h-full"
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
