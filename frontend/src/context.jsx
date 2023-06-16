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

  const checkLogginFlag = 0;

  const triggerAlert = (msg) => {
    /**
     * This function is use to trigger the alert from anywhere in the application.
     * just use "context_name.triggerAlert(message_body);"
     */
    console.log(msg);
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
      console.log(data);
      if (resp.ok) {
        if (data.success) {
          setLoggedin(true);
          setUsername(data.user_name);
          if (data.token) {
            localStorage.setItem("access_token", data.token);
          }
        }
      }
    } else {
      setLoggedin(false);
      setUsername("");
    }
  };

  const setNewAccessToken = (token) => {
    localStorage.setItem("access_token", token);
  };

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
      }}
    >
      {/* children will be the element that'd be wrapped up inside of this element */}
      {children}
    </context.Provider>
  );
};

export default Global;
export { context };
