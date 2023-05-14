import React, { useEffect, useMemo, useState } from "react";
import TextTransition from "react-text-transition";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";

const HomeHero = () => {
  /**
   *
   */
  const TEXT = ["Click", "Try", "Upload", "UShare"]; // Text that will shown in slide up animation
  const IMAGES = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
    "/images/hero4.jpg",
  ];

  const [index, setIndex] = useState(0); // state for text change animation.

  useEffect(() => {
    const intervalId = setInterval(
      /**
       * interval for text animation.
       * @returns increments the index
       */
      () => setIndex((index) => index + 1),
      2000 // every 2 seconds
    );
    return () => clearTimeout(intervalId); // the interval will be cleared just before the element going to be unmount.
  }, []);

  // useMemo(() => {
  //   // setTimeout(() => {
  //   //   const newText = document.createElement("span");
  //   //   newText.appendChild(document.createTextNode(textArray[0]));
  //   //   newText.style.opacity = "0";
  //   //   newText.style.position = "absolute";
  //   //   newText.style.top = "100%";
  //   //   newText.style.transition = "all .2s";
  //   //   if (text.current) {
  //   //     text.current.appendChild(newText);
  //   //     // console.log(text.current.children);
  //   //     text.current.children[0].style.top = "-100%";
  //   //     text.current.children[0].style.opacity = "0";
  //   //     text.current.children[1].style.top = "10%";
  //   //     text.current.children[1].style.opacity = "1";
  //   //     text.current.children[0].addEventListener("transitionend", () => {
  //   //       text.current.removeChild(text.current.children[0]);
  //   //     });
  //   //   }
  //   // }, 1000);
  // }, []);

  return (
    <div className="relative">
      <div
        className="w-full h-full z-10 absolute top-0 left-0"
        style={{
          backgroundImage: "linear-gradient(45deg, #a1a1a1ad, #00000096)",
        }}
      ></div>
      <Swiper
        loop={true}
        allowTouchMove={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={3000}
        effect="fade"
        className="z-0"
      >
        {IMAGES.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              className="h-screen w-full object-cover"
              alt="slider-img"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-center items-center flex-col gap-4 absolute top-0 z-20 right-0 px-6 w-full h-full">
        <p className="flex gap-3 sm:text-6xl text-teal-400 font-bold text-4xl">
          Let's{" "}
          <span className="text-slate-300">
            <TextTransition>{TEXT[index % TEXT.length]}</TextTransition>
          </span>
        </p>
        <Link
          to="/auth/login"
          className="px-4 py-1 rounded-md font-bold text-slate-200 text-2xl bg-teal-400 transition-colors duration-500 hover:text-slate-200 hover:bg-slate-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomeHero;
