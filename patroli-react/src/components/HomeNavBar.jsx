import { NavBar } from "antd-mobile";
import ConenctionStatus from "./ConnectionStatus";
import useLogout from "../hooks/useLogout";
import { SetOutline } from "antd-mobile-icons";
import { Link } from "react-router";

const Right = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Link to="/setting" style={{ color: "white", marginRight: 10 }}>
        <SetOutline style={{ fontSize: "20px" }} />
      </Link>

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
