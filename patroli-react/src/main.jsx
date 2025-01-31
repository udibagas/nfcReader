import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConnectionProvider } from "./context/ConnectionContext.jsx";

const renderReactDom = () => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ConnectionProvider>
        <App />
      </ConnectionProvider>
    </StrictMode>
  );
};

if (window.cordova) {
  document.addEventListener("deviceready", renderReactDom, false);
} else {
  renderReactDom();
}
