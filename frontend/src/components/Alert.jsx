import { useRef, useEffect, useContext } from "react";
import { context } from "../context";

const Alert = () => {
    const globalVal = useContext(context);
    const alertText = useRef();
    const alertDiv = useRef();
    // const aText =
    //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quibusdam natus consequuntur veniam labore atque.";
    const aText = globalVal.alertMsg;
    let clearTextInt, textAddInt, invokeClearTextTO;

    const alertTextClear = () => {
        let initIndex = aText.length;
        clearTextInt = setInterval(() => {
            if (initIndex >= 0) {
                alertText.current.innerHTML = aText.slice(0, initIndex);
                initIndex--;
            } else {
                alertText.current.classList.add("hidden");
                alertDiv.current.classList.remove("top-3");
                clearInterval(clearTextInt);
            }
        });
    };

    const alertTextAnim = (e) => {
        if (e.target.classList.contains("top-3")) {
            alertText.current.classList.remove("hidden");
            let initIndex = 0;
            textAddInt = setInterval(() => {
                if (initIndex < aText.length) {
                    alertText.current.innerHTML += aText[initIndex];
                    initIndex++;
                } else {
                    clearInterval(textAddInt);
                    invokeClearTextTO = setTimeout(
                        () => {
                            alertTextClear();
                        },
                        aText.length > 50 ? 5000 : 3000
                    );
                }
            });
        } else {
            globalVal.setShowAlert(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            alertDiv.current.classList.add("top-3");
        }, 100);
        return () => {
            clearInterval(clearTextInt);
            clearInterval(textAddInt);
            clearTimeout(invokeClearTextTO);
        };
    }, []);

    return (
        <div
            className="fixed -top-20 left-3 transition-all duration-300 z-100"
            ref={alertDiv}
            onTransitionEnd={alertTextAnim}
        >
            <div className="bg-red-400 flex items-center gap-1 sm:gap-3 px-3 py-1 rounded-full transition-all duration-300 w-full">
                <div>
                    <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-5 sm:w-7 text-slate-50"
                    >
                        <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                        ></path>
                    </svg>
                </div>
                <div
                    className="text-slate-50 text-xs hidden font-bold"
                    ref={alertText}
                ></div>
            </div>
        </div>
    );
};

export default Alert;
