import { useEffect, useContext, useRef, useMemo } from "react";
import { context } from "../context";

const Gallery = () => {
  const globalVal = useContext(context);
  const searchInput = useRef();
  const searchTextArr = ["Nature", "Wallpaper", "Sports"];

  useEffect(() => {
    globalVal.setBallPos(2);
  }, []);

  function abc() {
    // let index2 = 2;
    // let interval1, interval2;
    // function first() {
    //   // interval1 = setInterval(() => {
    //   //   index2 = index2 < searchTextArr.length ? index2 + 1 : 0;
    //   //   console.log(index2);
    //   //   second();
    //   // });
    //   second();
    // }
    // function second() {
    //   let index = 0;
    //   const textArr = searchTextArr[index2].split("");
    //   clearInterval(interval1);
    //   interval2 = setInterval(() => {
    //     if (index < textArr.length) {
    //       searchInput.current.placeholder =
    //         searchInput.current.placeholder + textArr[index];
    //       index++;
    //     } else {
    //       searchInput.current.placeholder = "Search for ";
    //       clearInterval(interval2);
    //       index2 = index2 < searchTextArr.length - 1 ? index2 + 1 : 0;
    //       first();
    //     }
    //   }, 1000);
    // }
    // second();
  }

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
          <button className="bg-slate-300 px-4 font-bold text:sm sm:text-lg">
            Search
          </button>
        </form>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Gallery;
