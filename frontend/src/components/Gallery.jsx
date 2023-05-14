import { useEffect, useContext, useRef, useMemo, useState } from "react";
import { context } from "../context";
import ImgGrid from "./ImgGrid";

const Gallery = () => {
  const globalVal = useContext(context);
  const searchInput = useRef();
  const searchTextArr = ["Nature", "Wallpaper", "Sports"];

  useEffect(() => {
    globalVal.setBallPos(2);
    globalVal.setShowBall(true);
  }, []);

  useEffect(() => {
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
          <span className="text-stone-800 text-5xl">R</span>ecommende
          <span className="text-slate-800 text-5xl">d</span>
        </h1>
        {/* <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colItem.map((col, index) => (
            <ImgGridCol items={col} key={index} />
          ))}
        </div> */}
        <ImgGrid showUserInfo={true} />
      </div>
    </div>
  );
};

export default Gallery;
