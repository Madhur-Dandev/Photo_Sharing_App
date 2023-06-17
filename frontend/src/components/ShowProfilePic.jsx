import { useContext, useEffect, useRef } from "react";
import { context } from "../context";

const ShowProfilePic = () => {
  const globalVal = useContext(context);
  const component = useRef();
  const image = useRef();

  let keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  function preventDefault(e) {
    e.preventDefault();
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  // modern Chrome requires { passive: false } when adding event
  let supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  let wheelOpt = supportsPassive ? { passive: false } : false;
  let wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  // call this to Disable
  function disableScroll() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  // call this to Enable
  function enableScroll() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  const show = () => {
    if (component.current) {
      component.current.style.height = `${window.innerHeight}px`;
    }

    if (image.current) {
      if (globalVal.imageUrlAndPos.pos) {
        image.current.style.height = `${globalVal.imageUrlAndPos.pos.height}px`;
        image.current.style.width = `${globalVal.imageUrlAndPos.pos.width}px`;
        image.current.style.top = `${
          globalVal.imageUrlAndPos.pos.top -
          globalVal.imageUrlAndPos.pos.height / 2
        }px`;
        image.current.style.left = `${globalVal.imageUrlAndPos.pos.left}px`;
        image.current.style.borderRadius = "50%";
      }
    }

    setTimeout(() => {
      image.current.style.height = `250px`;
      image.current.style.width = `250px`;
      image.current.style.top = `${window.innerHeight / 2 - 250 / 2}px`;
      image.current.style.left = `${window.innerWidth / 2 - 250 / 2}px`;
      image.current.style.borderRadius = "0%";
    }, 0);

    if (globalVal.imageUrlAndPos.url) {
      disableScroll();
      component.current.classList.remove("hidden");
      //   component.current.parentNode.parentNode.parentNode.classList.add("fixed");
      setTimeout(() => {
        component.current.classList.add("backdrop-blur-lg");
        component.current.classList.add("bg-slate-900");
      }, 0);
    }
  };

  const hide = () => {
    enableScroll();
    component.current.classList.remove("backdrop-blur-lg");
    component.current.classList.remove("bg-slate-900");
    image.current.style.height = `${globalVal.imageUrlAndPos.pos.height}px`;
    image.current.style.width = `${globalVal.imageUrlAndPos.pos.width}px`;
    image.current.style.top = `${
      globalVal.imageUrlAndPos.pos.top - globalVal.imageUrlAndPos.pos.height / 2
    }px`;
    image.current.style.left = `${globalVal.imageUrlAndPos.pos.left}px`;
    image.current.style.borderRadius = "50%";

    setTimeout(() => {
      component.current.classList.add("hidden");
      image.current.style.height = `0px`;
      image.current.style.width = `0px`;
      image.current.style.top = `0px`;
      image.current.style.left = `0px`;
      image.current.style.borderRadius = "0%";
    }, 300);
  };

  useEffect(() => {
    show();
  }, [globalVal.imageUrlAndPos]);

  return (
    <div
      className="fixed w-full h-full z-40 hidden bg-opacity-40 transition-all duration-300"
      ref={component}
      onClick={(e) => {
        console.log(document.createElement("div"));
        hide();
      }}
    >
      <img
        src="https://lh3.googleusercontent.com/a/AAcHTtctg_ygt-P_Bz2FQAjPkYeps_EgmRE1vmrSp2OL=s96-c"
        className="w-28 h-28 transition-all duration-300 relative top-0"
        ref={image}
      />
    </div>
  );
};

export default ShowProfilePic;
