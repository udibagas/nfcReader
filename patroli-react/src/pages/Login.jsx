import { Navigate, useNavigate } from "react-router";
import { login } from "../utils/api";
import { Button, Dialog, Divider, Form, Input } from "antd-mobile";
import { LockOutline, UserOutline } from "antd-mobile-icons";
import { useState } from "react";
import ConenctionStatus from "../components/ConnectionStatus";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      navigate("/");
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
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <ConenctionStatus
        style={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
      />
      <div className="header-container">
        <h1 className="header">APLIKASI PATROLI</h1>
        <h3>PT. Ungaran Sari Garments</h3>
      </div>
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
              loadingText="Mengirim data..."
            >
              LOGIN
            </Button>

            <Divider>Atau</Divider>
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
            </Button>
          </>
        }
      >
        <Form.Item
          label={<UserOutline />}
          name="name"
          rules={[{ required: true, message: "Masukkan username Anda!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          label={<LockOutline />}
          name="password"
          rules={[{ required: true, message: "Masukkan password Anda!" }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
