import { Link, Navigate, useNavigate } from "react-router";
import { login } from "../utils/api";
import { Button, Dialog, Form, Input } from "antd-mobile";
import { LockOutline, SetOutline, UserOutline } from "antd-mobile-icons";
import { useContext, useState } from "react";
import AppInfo from "../components/AppInfo";
import ConnectionContext from "../context/ConnectionContext";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isConnected = useContext(ConnectionContext);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      navigate("/", { replace: true });
    } catch (error) {
      Dialog.alert({
        title: "Login Gagal",
        content: error.response?.data?.message || error.message,
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <Link
        to="/setting"
        style={{ color: "white", position: "absolute", top: 20, left: 25 }}
      >
        <SetOutline style={{ fontSize: "20px" }} />
      </Link>

      <AppInfo />

      <Form
        layout="horizontal"
        mode="card"
        requiredMarkStyle="optional"
        onFinish={handleFinish}
        style={{
          "--prefix-width": "30px",
        }}
        footer={
          <>
            <Button
              color="primary"
              size="large"
              block
              type="submit"
              loading={loading}
              disabled={!isConnected}
              loadingText="Mengirim data"
            >
              LOGIN
            </Button>

            {/* <Divider>Atau</Divider>
            <Button
              block
              color="primary"
              fill="outline"
              size="large"
              onClick={() => {
                navigate("/register");
              }}
            >
              DAFTAR
            </Button> */}
          </>
        }
      >
        <Form.Item
          label={<UserOutline />}
          name="name"
          rules={[{ required: true, message: "Masukkan username Anda!" }]}
        >
          <Input placeholder="Username" clearable />
        </Form.Item>

        <Form.Item
          label={<LockOutline />}
          name="password"
          rules={[{ required: true, message: "Masukkan password Anda!" }]}
        >
          <Input type="password" placeholder="Password" clearable />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
