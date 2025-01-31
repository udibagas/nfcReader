import { Form, NavBar, Input, Button, Dialog } from "antd-mobile";
import { useNavigate } from "react-router";
import { API_URL, checkConnection } from "../utils/api";
import { useState } from "react";

const Setting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("URL server tidak valid!");
    }
  }

  async function handleFormSubmit(values) {
    const { baseURL } = values;
    setLoading(true);

    try {
      isValidURL(baseURL);
      localStorage.setItem("baseURL", baseURL);
      await checkConnection();
      Dialog.alert({
        title: "Berhasil",
        content: "Server URL berhasil disimpan",
        confirmText: "OK",
      });
    } catch (error) {
      Dialog.alert({
        title: "Error",
        content: error.message,
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar
        style={{
          backgroundColor: "#1C497F",
          color: "white",
          height: "60px",
        }}
        onBack={() => navigate(-1)}
      >
        PENGATURAN
      </NavBar>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 60px)",
          width: "100%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Form
          mode="card"
          onFinish={handleFormSubmit}
          requiredMarkStyle="optional"
          style={{
            width: "90%",
          }}
          footer={
            <Button
              color="primary"
              block
              size="large"
              type="submit"
              loading={loading}
              loadingText="Menyimpan"
            >
              SIMPAN
            </Button>
          }
        >
          <Form.Item
            label="Server URL"
            name="baseURL"
            initialValue={API_URL}
            rules={[{ required: true, message: "Server URL harus diisi" }]}
          >
            <Input placeholder="Server URL" clearable />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Setting;
