import { Navigate, useNavigate } from "react-router";
import { getSites, register } from "../utils/api";
import { Button, Dialog, Divider, Form, Input, Selector } from "antd-mobile";
import {
  EnvironmentOutline,
  LockOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useEffect, useState } from "react";
import ConenctionStatus from "../components/ConnectionStatus";
import AppInfo from "../components/AppInfo";

const Register = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    getSites().then((data) => {
      if (ignore) return;
      setSites(data);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const handleFinish = async (values) => {
    Dialog.confirm({
      title: "Konfirmasi",
      content: "Apakah data yang Anda masukkan sudah benar?",
      confirmText: "Ya",
      cancelText: "Tidak",
      onConfirm: () => {
        setLoading(true);
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
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <ConenctionStatus
        style={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
        onConnected={() => {
          if (!sites.length) {
            getSites().then((data) => {
              setSites(data);
            });
          }
        }}
      />

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
              loadingText="Mengirim data..."
            >
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

export default Register;
