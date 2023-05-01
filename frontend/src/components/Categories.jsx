import React from "react";

const Categories = () => {
  return (
    <div className="p-5 pb-14">
      <h1 className="text-4xl font-bold spacing relative tracking-wide uppercase w-max text-center m-auto whitespace-nowrap pb-3 after:bg-red-800 after:absolute after:right-0 after:bottom-0 after:block after:h-1 after:w-20 after:mb-1 before:bg-red-800   before:block before:h-1 before:w-20 before:mb-1">
        Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <a href="">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffffb2, #000000b2), url(/images/cat1.jpg)",
            }}
            className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
          >
            <p
              className="text-slate-100 font-bold text-4xl"
              style={{ textShadow: "0px 2px 10px white" }}
            >
              Motivation
            </p>
          </div>
        </a>
        <a href="">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffffb2, #000000b2), url(/images/cat2.jpg)",
            }}
            className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
          >
            <p
              className="text-slate-100 font-bold text-4xl"
              style={{ textShadow: "0px 2px 10px white" }}
            >
              Motivation
            </p>
          </div>
        </a>
        <a href="">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffffb2, #000000b2), url(/images/cat3.jpg)",
            }}
            className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
          >
            <p
              className="text-slate-100 font-bold text-4xl"
              style={{ textShadow: "0px 2px 10px white" }}
            >
              Motivation
            </p>
          </div>
        </a>
        <a href="">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffffb2, #000000b2), url(/images/cat4.jpg)",
            }}
            className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
          >
            <p
              className="text-slate-100 font-bold text-4xl"
              style={{ textShadow: "0px 2px 10px white" }}
            >
              Motivation
            </p>
          </div>
        </a>
        <a href="">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffffb2, #000000b2), url(/images/cat5.jpg)",
            }}
            className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
          >
            <p
              className="text-slate-100 font-bold text-4xl"
              style={{ textShadow: "0px 2px 10px white" }}
            >
              Motivation
            </p>
          </div>
        </a>
        <a href="">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffffb2, #000000b2), url(/images/cat6.jpg)",
            }}
            className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
          >
            <p
              className="text-slate-100 font-bold text-4xl"
              style={{ textShadow: "0px 2px 10px white" }}
            >
              Motivation
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Categories;
