import { useRef, useContext, useState } from "react";
import { context } from "../context";

const UploadForm = () => {
  const globalVal = useContext(context);
  const [image, setImage] = useState({});
  const file = useRef();
  const dropContainer = useRef();

  return (
    <div className="grid place-items-center">
      <div className="w-3/4 mx-auto h-screen">
        <h1 className="text-center text-4xl m-3 font-bold">
          Upload Your Photo
        </h1>
        <div
          className="border-2 border-red-50 border-dashed flex flex-col justify-center items-center"
          style={{
            height: "650px",
          }}
          onClick={() => file.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.target.classList.add("border-red-400");
          }}
          onDragLeave={(e) => {
            e.target.classList.add("");
          }}
          onDrop={(e) => {
            e.preventDefault();
            setImage(e.dataTransfer.files[0]);
            if (e.dataTransfer.files.length !== 1) {
              console.log("Cannot upload more than 1 file.");
              globalVal.setAlertMsg("Cannot upload more than 1 file.");
              globalVal.setShowAlert(false);
              setTimeout(() => {
                globalVal.setShowAlert(true);
              }, 1);
            }
            e.target.classList.add("border-green-400");
            e.target.classList.remove("border-red-400");
          }}
          ref={dropContainer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-36 h-36"
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
          />
          <h2>Drag the file here or click on camera</h2>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
