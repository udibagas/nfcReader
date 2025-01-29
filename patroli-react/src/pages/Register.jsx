import { Navigate, useNavigate } from "react-router";
import { getSites, register } from "../utils/api";
import { Button, Dialog, Divider, Form, Input, Selector } from "antd-mobile";
import {
  EnvironmentOutline,
  LockOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useEffect, useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);

  useEffect(() => {
    getSites().then((data) => {
      setSites(data);
    });
  }, []);

  const handleFinish = async (values) => {
    Dialog.confirm({
      title: "Konfirmasi",
      content: "Apakah data yang Anda masukkan sudah benar?",
      confirmText: "Ya",
      cancelText: "Tidak",
      onConfirm: () => {
        register(values)
          .then(() => {
            Dialog.alert({
              title: "Sukses",
              content: "Registrasi berhasil!",
              confirmText: "OK",
            });
            navigate("/login");
          })
          .catch((error) => {
            Dialog.alert({
              title: "Registrasi Gagal",
              content: error.response?.data?.message || error.message,
              confirmText: "OK",
            });
          });
      },
    });
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
            <Button color="primary" size="large" block type="submit">
              DAFTAR
            </Button>

            <Divider>Atau</Divider>
            <Button
              block
              color="primary"
              fill="outline"
              size="large"
              onClick={() => {
                navigate("/login");
              }}
            >
              LOGIN
            </Button>
          </>
        }
      >
        <Form.Item
          label={<EnvironmentOutline />}
          name="SiteId"
          rules={[{ required: true, message: "Pilih Site!" }]}
        >
          <Selector
            columns={1}
            options={sites.map((site) => ({
              label: site.name,
              value: site.id,
            }))}
          />
        </Form.Item>

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

export default Register;
