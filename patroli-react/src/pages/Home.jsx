import {
  Form,
  Input,
  NavBar,
  TextArea,
  Button,
  Checkbox,
  Space,
  Dialog,
  Image,
} from "antd-mobile";
import { Navigate, useNavigate } from "react-router";
import { base64ToBlob, getTemplates, logout, saveData } from "../utils/api";
import { useState, useEffect, useRef } from "react";
import { CameraOutline } from "antd-mobile-icons";

// const demoImages = [
//   "https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
//   "https://images.unsplash.com/photo-1601128533718-374ffcca299b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3128&q=80",
//   "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3113&q=80",
//   "https://images.unsplash.com/photo-1624993590528-4ee743c9896e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=1000&q=80",
// ];

const Home = () => {
  const [template, setTemplate] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")).name;
  const site = JSON.parse(localStorage.getItem("user")).Site.name;
  const [location, setLocation] = useState("");
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const files = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    getTemplates().then((data) => {
      if (ignore) return;
      setTemplate(data.data);
    });

    window.nfc?.addNdefListener(
      function (nfcEvent) {
        const tag = nfcEvent.tag;
        const ndefMessage = tag.ndefMessage;

        if (ndefMessage && ndefMessage.length > 0) {
          const payload = window.nfc?.bytesToString(ndefMessage[0].payload);

          // Remove the language code prefix (if any)
          const l = payload[0] === "\u0002" ? payload.substring(3) : payload;
          setLocation(l);
        } else {
          alert("NFC tag masih kosong!");
        }
      },
      function () {
        console.log("Listening for NDEF tags...");
      },
      function () {
        Dialog.alert({
          title: "Error",
          content: "Aktifkan NFC dan buka aplikasi ini lagi!",
          confirmText: "OK",
        });

        navigator.app.exitApp();
      }
    );

    return () => {
      ignore = true;
      window.nfc?.removeNdefListener();
    };
  }, []);

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  function submitForm(values) {
    Dialog.confirm({
      title: "Peringatan",
      content: "Apakah Anda yakin ingin menyimpan data?",
      cancelText: "Tidak",
      confirmText: "Ya",
      onConfirm: () => {
        saveData(values, files.current)
          .then(() => {
            form.resetFields();
            setImages([]);
            files.current = [];
          })
          .catch((error) => {
            Dialog.alert({
              title: "Error",
              content: error.response?.data?.message || error.message,
              confirmText: "OK",
            });
          });
      },
    });
  }

  function handleLogout() {
    Dialog.confirm({
      title: "Peringatan",
      content: "Apakah Anda yakin ingin keluar?",
      cancelText: "Tidak",
      confirmText: "Ya",
      onConfirm: () => {
        logout()
          .then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          })
          .catch((error) => {
            Dialog.alert({
              title: "Logout Gagal",
              content: error.response?.data?.message || error.message,
              confirmText: "OK",
            });
          });
      },
    });
  }

  function takePicture() {
    navigator.camera?.getPicture(
      (imageData) => {
        setImages([...images, imageData]);

        const imageBlob = base64ToBlob(imageData, "image/jpeg");
        const file = new File([imageBlob], "image.jpeg", {
          type: "image/jpeg",
        });

        files.current.push(file);
      },
      (message) => {
        Dialog.alert({
          title: "Error",
          content: message,
          confirmText: "OK",
        });
      },
      {
        quality: 30,
        destinationType: window.Camera.DestinationType.DATA_URL,
        correctOrientation: true,
        cameraDirection: window.Camera.Direction.BACK,
      }
    );
  }

  return (
    <div className="home-container">
      <NavBar
        style={{
          backgroundColor: "#1C497F",
          color: "white",
        }}
        onBack={handleLogout}
      >
        SISTEM PATROLI USG
      </NavBar>

      <div className="main-content">
        <div className="header-container">
          <h3>Selamat Pagi {user}!</h3>
        </div>

        <Form
          requiredMarkStyle="optional"
          onFinish={submitForm}
          form={form}
          footer={
            <>
              <Button
                style={{ marginBottom: 15 }}
                block
                color="primary"
                fill="outline"
                onClick={takePicture}
              >
                <CameraOutline />
              </Button>
              <Button color="primary" block type="submit">
                SIMPAN
              </Button>
            </>
          }
        >
          <Form.Item label="Site">
            <Input placeholder="Site" value={site} disabled />
          </Form.Item>

          <Form.Item
            name="location"
            label="Lokasi"
            rules={[{ required: true, message: "Masukkan lokasi!" }]}
          >
            <Input placeholder="Lokasi" value={location} />
          </Form.Item>

          <Form.Item name="keterangan" label="Keterangan">
            <Checkbox.Group>
              <Space direction="vertical">
                {template.map((item) => (
                  <Checkbox key={item.id} value={item.result}>
                    {item.result}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="keteranganTambahan" label="Keterangan Tambahan">
            <TextArea placeholder="Keterangan Tambahan" rows={2} />
          </Form.Item>

          {images.length > 0 && (
            <Form.Item label="Foto">
              <Space direction="horizontal" wrap>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt="preview"
                    width={100}
                    height={100}
                    fit="cover"
                  />
                ))}
              </Space>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Home;
