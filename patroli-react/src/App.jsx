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
import { useEffect, useRef } from "react";
import useLogout from "./hooks/useLogout";
import "./App.css";
import Setting from "./components/Setting";

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
  const handleLogout = useLogout();

  useEffect(() => {
    function handleBackButton(event) {
      event.preventDefault();
      if (location.pathname === "/") handleLogout();
      if (location.pathname === "/register") navigate("/login");
      if (location.pathname === "/login") navigator.app.exitApp();
      if (location.pathname === "/setting") navigate(-1);
    }

    document.addEventListener("backbutton", handleBackButton, false);

    return () => {
      document.removeEventListener("backbutton", handleBackButton, false);
    };
  }, [handleLogout, navigate, location.pathname]);

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
            <Route path="/setting" element={<Setting />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
