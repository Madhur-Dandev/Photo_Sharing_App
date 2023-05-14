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
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Global;
export { context };
