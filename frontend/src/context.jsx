import { createContext, useState } from "react";

const context = createContext();

const Global = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <context.Provider
      value={{
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default Global;
export { context };
