import { Navigate, useNavigate } from "react-router";
import { login } from "../utils/api";
import { Button, Dialog, Divider, Form, Input } from "antd-mobile";
import { LockOutline, UserOutline } from "antd-mobile-icons";

const Login = () => {
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      await login(values);
      navigate("/");
    } catch (error) {
      Dialog.alert({
        title: "Login Gagal",
        content: error.response?.data?.message || error.message,
        confirmText: "OK",
      });
    }
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
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
            <Button color="primary" block type="submit">
              LOGIN
            </Button>

            <Divider>Atau</Divider>
            <Button
              block
              color="primary"
              fill="outline"
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
