import { createContext, useState } from "react";

const context = createContext();

const Global = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [ballPos, setBallPos] = useState(1);
  const [showImgDetails, setShowImgDetails] = useState(false);
  const [imgDetails, setImgDetails] = useState({});

  return (
    <context.Provider
      value={{
        showSidebar,
        setShowSidebar,
        ballPos,
        setBallPos,
        showImgDetails,
        setShowImgDetails,
        imgDetails,
        setImgDetails,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Global;
export { context };
