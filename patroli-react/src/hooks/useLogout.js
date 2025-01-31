import { Dialog } from "antd-mobile";
import { logout } from "../utils/api";
import { useNavigate } from "react-router";

const useLogout = () => {
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
            console.log(error);
            // Dialog.alert({
            //   title: "Error",
            //   content: error.response?.data?.message || error.message,
            //   confirmText: "OK",
            // });
          })
          .finally(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
          });
      },
    });
  }

  return handleLogout;
};

export default useLogout;
