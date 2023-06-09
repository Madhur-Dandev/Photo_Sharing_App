import { useRef, useContext, useState, useEffect } from "react";
import { context } from "../context";
import { useNavigate } from "react-router-dom";

const UploadForm = () => {
  /**
   * This form is use to upload image to the server. (Only register user can do this)
   */

  const navigation = useNavigate(); // object for integrating react router dom navigation.

  const globalVal = useContext(context);
  const [image, setImage] = useState({}); // The file of image uploaded by user will set here.
  const [showPreview, setShowPreview] = useState(false); // new preview image will set here and if any existing previous image available will removed.
  const file = useRef();
  const dropContainer = useRef();
  const previewContainer = useRef();

  console.log(image);

  const setUploadImage = (files) => {
    /**
     * This function will check it selected docuement is image or not and if it is then it will set preview image.
     */
    if (files[0].type.includes("image")) {
      if (files.length > 1) {
        globalVal.triggerAlert("Cannot upload more than 1 file.");
      }
      setImage(files[0]);
      setShowPreview(true);
      dropContainer.current.classList.add("border-green-400");
    } else {
      globalVal.triggerAlert("File must be image");
    }
    dropContainer.current.classList.remove("border-red-400");
  };

  useEffect(() => {
    /**
     * It will read the image from file object then display it to user.
     */
    if (showPreview) {
      const previewImg = document.createElement("img");
      previewImg.src = (window.URL ? URL : webkitURL).createObjectURL(image);
      previewImg.className = "w-full h-full object-contain";
      previewContainer.current.append(previewImg);
    }
  }, [showPreview]);

  useEffect(() => {
    /**
     * This is will if user is logged in or not before access this page.
     */
    globalVal.setShowBall(false);
    if (!globalVal.loggedin) navigation("/auth/login");
  }, []);

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
              /**
               * The file dialog will open programmatically.
               */
              if (!showPreview) file.current.click();
            }}
            onDragOver={(e) => {
              /**
               * If user drag their mouse over this div then border color will change.
               */
              e.preventDefault();
              e.target.classList.add("border-red-400");
            }}
            onDragLeave={(e) => {
              /**
               * After leaving, border should be back to it's original color.
               */
              e.target.classList.remove("border-red-400");
            }}
            onDrop={(e) => {
              /**
               * It will get the image object and save it to current state.
               */
              e.preventDefault();
              if (!showPreview) setUploadImage(e.dataTransfer.files);
              else globalVal.triggerAlert("Please remove the image first");
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
