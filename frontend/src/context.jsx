import { createContext, useState } from "react";

const context = createContext();

const Global = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [ballPos, setBallPos] = useState(1);
  const [showBall, setShowBall] = useState(false);
  const [showImgDetails, setShowImgDetails] = useState(false);
  const [imgDetails, setImgDetails] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const triggerAlert = (msg) => {
    console.log(msg);
    setAlertMsg(msg);
    setShowAlert(false);
    setTimeout(() => {
      setShowAlert(true);
    }, 1);
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
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Global;
export { context };
