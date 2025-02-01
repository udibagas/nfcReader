import {
  Form,
  TextArea,
  Button,
  Checkbox,
  Space,
  Dialog,
  Image,
  Grid,
} from "antd-mobile";
import { Navigate } from "react-router";
import { base64ToBlob, getTemplates, saveData } from "../utils/api";
import { useState, useEffect, useRef, useContext } from "react";
import { CameraOutline } from "antd-mobile-icons";
import Clock from "../components/Clock";
import HomeNavBar from "../components/HomeNavBar";
import ConnectionContext from "../context/ConnectionContext";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user") || null);

  const [template, setTemplate] = useState([]);
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const isConnected = useContext(ConnectionContext);

  const [form] = Form.useForm();
  const files = useRef([]);

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

  // Clear location after 5 minutes
  useEffect(() => {
    let timeOut = setTimeout(() => {
      if (location) setLocation("");
    }, 1000 * 60 * 5);

    return () => {
      clearTimeout(timeOut);
    };
  }, [location]);

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  function validateForm({ keterangan: result = [], keteranganTambahan }) {
    try {
      if (!location) {
        throw new Error("Tempelkan NFC Tag terlebih dahulu!");
      }

      if (keteranganTambahan) {
        result.push(keteranganTambahan);
      }

      if (!result.length === 0) {
        throw new Error(
          "Pilih minimal satu keterangan atau tulis keterangan tambahan!"
        );
      }

      if (files.current.length === 0) {
        throw new Error("Ambil foto terlebih dahulu!");
      }
    } catch (error) {
      Dialog.alert({
        title: "Error",
        content: error.message,
        confirmText: "OK",
      });
      return false;
    }

    return { location, result };
  }

  function submitForm(values) {
    const data = validateForm(values);
    if (!data) return;

    if (!isConnected) {
      Dialog.alert({
        title: "Error",
        content: "Anda berada diluar jaringan!",
        confirmText: "OK",
      });
      return;
    }

    Dialog.confirm({
      title: "Peringatan",
      content: "Apakah Anda yakin ingin menyimpan data?",
      cancelText: "Tidak",
      confirmText: "Ya",
      onConfirm: () => {
        setLoading(true);
        saveData(data, files.current)
          .then(() => {
            resetForm();
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

  function handleResetButton() {
    if (!form.isFieldsTouched() && !location && !files.current.length) return;
    Dialog.confirm({
      title: "Peringatan",
      content: "Apakah Anda yakin ingin mereset form?",
      cancelText: "Tidak",
      confirmText: "Ya",
      onConfirm: () => {
        resetForm();
      },
    });
  }

  function resetForm() {
    form.resetFields();
    files.current = [];
    setLocation("");
    setImages([]);
  }

  return (
    <div className="home-container" style={{ backgroundColor: "#f1f1f1" }}>
      <HomeNavBar />

      <div className="main-content">
        <div className="header-container">
          <h2 style={{ marginTop: 0 }}>
            Selamat Pagi {user ? user.name : ""}!
          </h2>
          <Clock />
        </div>

        <Form
          requiredMarkStyle="optional"
          onFinish={submitForm}
          form={form}
          mode="card"
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
              <Grid columns={2} gap={8}>
                <Grid.Item>
                  <Button
                    block
                    size="large"
                    fill="outline"
                    color="danger"
                    onClick={handleResetButton}
                  >
                    RESET
                  </Button>
                </Grid.Item>
                <Grid.Item>
                  <Button
                    block
                    color="primary"
                    size="large"
                    type="submit"
                    loading={loading}
                    loadingText="Mengirim data"
                    disabled={!isConnected}
                  >
                    SIMPAN
                  </Button>
                </Grid.Item>
              </Grid>
            </>
          }
        >
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              padding: "20px 10px",
              fontSize: "1.3rem",
              color: location ? "green" : "red",
            }}
          >
            {location || "TEMPEL NFC TAG"}
          </div>

          <Form.Item name="keterangan">
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

          <Form.Item name="keteranganTambahan">
            <TextArea
              placeholder="Tulis keterangan tambahan jika ada"
              rows={2}
              autoSize
            />
          </Form.Item>

          {images.length > 0 && (
            <Form.Item>
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
