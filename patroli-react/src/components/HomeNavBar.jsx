import { NavBar } from "antd-mobile";
import useLogout from "../hooks/useLogout";

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
    >
      SISTEM PATROLI USG
    </NavBar>
  );
};

export default HomeNavBar;
