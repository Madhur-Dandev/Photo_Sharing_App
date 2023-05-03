import { useEffect, useContext } from "react";
import { context } from "../context";

function About() {
  const globalVal = useContext(context);

  useEffect(() => {
    globalVal.setBallPos(3);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center mx-10 sm:mx-32 my-10 lg:m-5 shadow-2xl">
        <div className="w-full h-80 lg:h-full lg:w-auto m-auto">
          <img
            src="/images/about1.jpg"
            alt="brand about image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="col-span-2 flex flex-col justify-center items-center p-3 sm:p-10 gap-7">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold">
            About Us - UShare
          </h1>
          <p className="text-center text-xs sm:text-sm">
            Welcome to UShare, the ultimate platform for sharing your photos
            with the world. Whether you are a professional photographer or a
            hobbyist, you can upload your photos to PhotoShare and let others
            view, like and download them. You can also browse through many
            different amazing photos from other users and discover new
            perspectives and inspirations. PhotoShare is easy to use, secure and
            free. Join PhotoShare today and unleash your creativity!
          </p>
        </div>
      </div>
      <div>
        <h2
          className="text-center text-3xl font-bold text-orange-400"
          style={{ textShadow: "0 0 40px #fff" }}
        >
          Guides
        </h2>
        <div>
          <div className="guide-container">
            <div className="guide-img-container">
              <img
                src="/images/guide1.jpg"
                alt="guide image first"
                className="guide-img"
              />
            </div>
            <div className="text-xs sm:text-sm md:text-base col-span-2 m-4">
              <strong>Click</strong> a photo of any event. If you are
              professional photographer, daily user or just a mobile worm, it
              doesn't matter.
            </div>
          </div>
          <div className="guide-container">
            <div className="guide-img-container">
              <img
                src="/images/guide2.jpeg"
                alt="guide image second"
                className="guide-img"
              />
            </div>
            <div className="text-xs sm:text-sm md:text-base col-span-2 m-4">
              Click and <strong>Try</strong>. Select best out of best image to
              share with the world and world will remember you.
            </div>
          </div>
          <div className="guide-container">
            <div className="guide-img-container">
              <img
                src="/images/guide3.jpg"
                alt="guide image third"
                className="guide-img"
              />
            </div>
            <div className="text-xs sm:text-sm upload m-4">
              Done Selection! Now it's time to <strong>upload</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
