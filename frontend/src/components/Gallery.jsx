import { useEffect, useContext, useRef } from "react";
import { context } from "../context";
import ImgGrid from "./ImgGrid";

const Gallery = () => {
  /**
   * Parent component for gallery page.
   */
  const globalVal = useContext(context); // access the global values of context.
  const searchInput = useRef();
  const searchTextArr = ["Nature", "Wallpaper", "Sports"]; // Each element will have typing animation for search input.

  useEffect(() => {
    /**
     * sets navigation icon ball position to 2 and shows the ball.
     */
    globalVal.setBallPos(2);
    globalVal.setShowBall(true);
  }, []);

  useEffect(() => {
    /**
     * Checks if the searchInput.current has any element.
     * If it is then starts the animation for search input's placeholder text.
     */
    let interval;
    if (searchInput.current) {
      let index2 = 0;
      function first() {
        let index = 0;
        const textArr = searchTextArr[index2].split("");
        interval = setInterval(() => {
          if (index < textArr.length) {
            searchInput.current.placeholder =
              searchInput.current.placeholder + textArr[index];
            index++;
          } else {
            searchInput.current.placeholder = "Search for ";
            clearInterval(interval);
            index2 = index2 < searchTextArr.length - 1 ? index2 + 1 : 0;
            first();
          }
        }, 300);
      }
      first();
    }
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="p-5">
        <form className="w-full flex rounded-md overflow-hidden">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for "
            ref={searchInput}
            className="w-full p-2 sm:p-3 text-slate-900 text-sm sm:text-base"
          />
          <button className="px-4 font-bold text:sm sm:text-lg bg-neutral-600">
            Search
          </button>
        </form>
      </div>
      <div className="p-5">
        <h1 className="text-4xl font-bold uppercase flex justify-center items-center my-5">
          <span className="text-gray-400 text-5xl">R</span>ecommende
          <span className="text-fuchsia-200 text-5xl">d</span>
        </h1>
        {/* <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colItem.map((col, index) => (
            <ImgGridCol items={col} key={index} />
          ))}
        </div> */}
        {/* Below element will display images in grid */}
        <ImgGrid showUserInfo={true} />
      </div>
    </div>
  );
};

export default Gallery;
