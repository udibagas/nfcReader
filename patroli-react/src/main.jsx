import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const renderReactDom = () => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

if (window.cordova) {
  document.addEventListener("deviceready", renderReactDom, false);
} else {
  renderReactDom();
}
