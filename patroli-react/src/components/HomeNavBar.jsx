import { NavBar } from "antd-mobile";
import ConenctionStatus from "./ConnectionStatus";
import useLogout from "../hooks/useLogout";

const Right = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <ConenctionStatus />
    </div>
  );
};

const HomeNavBar = () => {
  const handleLogout = useLogout();

  return (
    <NavBar
      style={{
        backgroundColor: "#1C497F",
        color: "white",
        height: "60px",
      }}
      onBack={handleLogout}
      right={<Right />}
    >
      SISTEM PATROLI USG
    </NavBar>
  );
};

export default HomeNavBar;
