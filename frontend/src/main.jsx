import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Global from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Global>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Global>
);
