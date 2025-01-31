import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import { useEffect, useRef } from "react";
import { Dialog } from "antd-mobile";

const App = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const nodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleBackButton(event) {
      event.preventDefault();

      if (location.pathname === "/") {
        Dialog.confirm({
          title: "Konfirmasi",
          content: "Apakah Anda yakin ingin keluar?",
          confirmText: "Ya",
          cancelText: "Tidak",
          onConfirm: () => navigate("/login"),
        });
      }

      if (location.pathname === "/register") navigate("/login");
      if (location.pathname === "/login") navigator.app.exitApp();
    }

    document.addEventListener("backbutton", handleBackButton, false);
    return () => {
      document.removeEventListener("backbutton", handleBackButton, false);
    };
  }, [location, navigate]);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="swap"
        timeout={300}
        nodeRef={nodeRef}
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
