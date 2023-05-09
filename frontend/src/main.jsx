import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Global from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Global>
    {/* Global context to access to gloval values. Allows to use some values in different components withour prop drilling */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Global>
);
