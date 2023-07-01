import { createContext, useState } from "react";

const context = createContext(); // creating a instance of context

const Global = ({ children }) => {
    /**
     * this component is use to initialize the global values that will be use in other components.
     */

    const [showSidebar, setShowSidebar] = useState(false);
    const [ballPos, setBallPos] = useState(1);
    const [showBall, setShowBall] = useState(false);
    const [showImgDetails, setShowImgDetails] = useState(false);
    const [imgDetails, setImgDetails] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [loggedin, setLoggedin] = useState(false);
    const [username, setUsername] = useState("");
    const [imageUrlAndPos, setImageUrlAndPos] = useState({});

    const triggerAlert = (msg) => {
        /**
         * This function is use to trigger the alert from anywhere in the application.
         * just use "context_name.triggerAlert(message_body);"
         */
        setAlertMsg(msg);
        setShowAlert(false); // it will clear the recent alert that still popped up.
        setTimeout(() => {
            /**
             * timeout to wait for sometime to again turn showAlert to true.
             */
            setShowAlert(true);
        }, 1);
    };

    const checkLogin = async () => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            const resp = await fetch(
                `http://localhost:5000/api/auth/check_loggedin/${access_token}`,
                {
                    credentials: "include",
                }
            );

            const data = await resp.json();
            if (resp.ok) {
                if (data.success) {
                    setLoggedin(true);
                    setUsername(data.user_name);
                }
            }

            if (resp.status === 401) {
                console.log("Log in again");
            }

            if (data.token) {
                localStorage.setItem("access_token", data.token);
            }
        } else {
            setLoggedin(false);
            setUsername("");
        }
    };

    const setNewAccessToken = (token) => {
        localStorage.setItem("access_token", token);
    };

    /* ----------------- Enable/Disable Scroll -------------------- */
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
    function disableScroll(object = window) {
        // console.log(object);
        document.querySelector("html").classList.add("scrollbar-hidden");
        object.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
        object.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        object.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
        object.addEventListener("keydown", preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll(object = window) {
        document.querySelector("html").classList.remove("scrollbar-hidden");
        object.removeEventListener("DOMMouseScroll", preventDefault, false);
        object.removeEventListener(wheelEvent, preventDefault, wheelOpt);
        object.removeEventListener("touchmove", preventDefault, wheelOpt);
        object.removeEventListener(
            "keydown",
            preventDefaultForScrollKeys,
            false
        );
    }

    /* ----------------- Enable/Disable Scroll -------------------- */

    return (
        <context.Provider
            value={{
                showSidebar,
                setShowSidebar,
                ballPos,
                setBallPos,
                showBall,
                setShowBall,
                showImgDetails,
                setShowImgDetails,
                imgDetails,
                setImgDetails,
                showAlert,
                setShowAlert,
                alertMsg,
                setAlertMsg,
                triggerAlert,
                loggedin,
                setLoggedin,
                username,
                setUsername,
                checkLogin,
                setNewAccessToken,
                imageUrlAndPos,
                setImageUrlAndPos,
                enableScroll,
                disableScroll,
            }}
        >
            {/* children will be the element that'd be wrapped up inside of this element */}
            {children}
        </context.Provider>
    );
};

export default Global;
export { context };
