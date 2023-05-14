import { useRef, useEffect, useContext } from "react";
import { context } from "../context";

const ColImg = ({ img, showUserInfo }) => {
  /**
   * This component is use display single image item of a grid image column
   */
  const globalVal = useContext(context);
  const image = useRef();

  useEffect(() => {
    // console.log(image.current);
  }, []);

  return (
    // section to display each image in gallery or search.
    <div
      className="relative group cursor-pointer"
      onClick={() => {
        /**
         * When any user clicks on image information will get stored in global values.
         * And also the image detail component showed up.
         */
        globalVal.setImgDetails({ ...img });
        globalVal.setShowImgDetails(true);
      }}
    >
      <img
        src={img.img}
        alt={img.user_name}
        className="w-full"
        loading="lazy"
        onLoad={() => console.log("hi")}
        ref={image}
      />
      {showUserInfo && (
        <div
          className="flex items-center gap-1 p-2 md:absolute md:w-full top-0 left-0 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-500 md:bg-opacity-50"
          style={{
            backgroundImage: "linear-gradient(to bottom, grey, transparent)",
          }}
        >
          <div className="w-9 h-9 overflow-hidden rounded-full ">
            <img
              src={img.user_avatar}
              alt={img.user_name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-base font-bold">{img.user_name}</p>
        </div>
      )}
    </div>
  );
};

export default ColImg;
