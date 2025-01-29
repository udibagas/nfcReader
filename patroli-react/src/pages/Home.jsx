import {
  Form,
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
import Clock from "../components/Clock";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user") || null);

  const [template, setTemplate] = useState([]);
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
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
          Dialog.alert({
            title: "Error",
            content: "Tag NFC tidak valid!",
            confirmText: "OK",
          });
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
        setLoading(true);
        saveData({ ...values, location }, files.current)
          .then(() => {
            form.resetFields();
            files.current = [];
            setLocation("");
            setImages([]);
            Dialog.alert({
              title: "Sukses",
              content: "Data berhasil disimpan!",
              confirmText: "OK",
            });
          })
          .catch((error) => {
            console.log(error);
            Dialog.alert({
              title: "Error",
              content: error.response?.data?.message || error.message,
              confirmText: "OK",
            });
          })
          .finally(() => {
            setLoading(false);
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
          <h2>Selamat Pagi {user ? user.name : ""}!</h2>
          <Clock />
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
                size="large"
                color="primary"
                fill="outline"
                onClick={takePicture}
              >
                <CameraOutline />
              </Button>
              <Button
                color="primary"
                block
                size="large"
                type="submit"
                loading={loading}
                loadingText="Mengirim data..."
              >
                SIMPAN
              </Button>
            </>
          }
        >
          <Form.Item label="Lokasi">
            {location ? (
              <div style={{ fontWeight: "bold", color: "green" }}>
                {location}
              </div>
            ) : (
              <div style={{ fontWeight: "bold", color: "red" }}>
                Tempel NFC Tag
              </div>
            )}
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
            <TextArea
              placeholder="Tulis keterangan tambahan jika ada"
              rows={2}
            />
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
