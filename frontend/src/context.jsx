import { createContext, useState } from "react";

const context = createContext();

const Global = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [ballPos, setBallPos] = useState(1);

  return (
    <context.Provider
      value={{
        showSidebar,
        setShowSidebar,
        ballPos,
        setBallPos,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Global;
export { context };
