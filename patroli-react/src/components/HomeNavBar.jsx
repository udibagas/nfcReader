import { Dialog, NavBar } from "antd-mobile";
import { useNavigate } from "react-router";
import { logout } from "../utils/api";
import ConenctionStatus from "./ConnectionStatus";

const HomeNavBar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    Dialog.confirm({
      title: "Peringatan",
      content: "Apakah Anda yakin ingin keluar?",
      cancelText: "Tidak",
      confirmText: "Ya",
      onConfirm: () => {
        logout()
          .then(() => {
            console.log("Logout success");
          })
          .catch((error) => {
            Dialog.alert({
              title: "Error",
              content: error.response?.data?.message || error.message,
              confirmText: "OK",
            });
          })
          .finally(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          });
      },
    });
  }

  return (
    <NavBar
      style={{
        backgroundColor: "#1C497F",
        color: "white",
        height: "60px",
      }}
      onBack={handleLogout}
      right={<ConenctionStatus />}
    >
      SISTEM PATROLI USG
    </NavBar>
  );
};

export default HomeNavBar;
