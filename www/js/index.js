const API_URL = "http://192.168.1.10:3000";
const token = localStorage.getItem("token");
let user = localStorage.getItem("user");
user = user ? JSON.parse(user) : null;
renderPage(token ? "home" : "login");

document.addEventListener("deviceready", ondDeviceReady);

function setLocation(location) {
  localStorage.setItem("location", location);

  const locationElement = document.querySelector("#location");
  locationElement.value = location;
  locationElement.classList.remove("error");
  locationElement.classList.add("success");

  // reset location after 5 minutes
  setTimeout(() => {
    localStorage.removeItem("location");
    locationElement.value = "[TEMPEL NFC]";
    locationElement.classList.remove("success");
    locationElement.classList.add("error");
  }, 1000 * 60 * 5);
}

function ondDeviceReady() {
  // Add listener for NDEF tags
  nfc.addNdefListener(
    function (nfcEvent) {
      // Get the NFC tag data
      const tag = nfcEvent.tag;
      const ndefMessage = tag.ndefMessage;

      // Decode the payload
      if (ndefMessage && ndefMessage.length > 0) {
        const payload = nfc.bytesToString(ndefMessage[0].payload);

        // Remove the language code prefix (if any)
        const location =
          payload[0] === "\u0002" ? payload.substring(3) : payload;

        setLocation(location);
      } else {
        alert("Empty NFC tag detected!");
      }
    },
    function () {
      console.log("Listening for NDEF tags...");
    },
    function (error) {
      alert("Error adding NFC listener:", error);
    }
  );
}

async function renderPage(page = "home") {
  const app = document.getElementById("app");

  try {
    const response = await fetch(`pages/${page}.html`);
    if (!response.ok) throw new Error("Page not found");
    const content = await response.text();
    app.innerHTML = content;

    if (page == "home") {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        document.querySelector("#user").innerHTML = user.name;
      } catch (error) {
        alert(error.message);
      }

      const response = await fetch(`${API_URL}/api/inspection-templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const templates = await response.json();
      const templateElement = document.querySelector("#template");

      templates.forEach((template) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `template-${template.id}`;
        checkbox.name = "keterangan";
        checkbox.value = template.result;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = `template-${template.id}`;
        label.appendChild(document.createTextNode(template.result));

        const div = document.createElement("div");
        div.className = "form-check";
        div.appendChild(checkbox);
        div.appendChild(label);

        templateElement.appendChild(div);
      });
    }
  } catch (error) {
    app.innerHTML = `<h1>404</h1><p>Page not found</p>`;
  }
}

async function login(event) {
  event.preventDefault();
  const email = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const credentials = { email, password, role: "user" };

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to login!");
    }

    const { token, user } = await response.json();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    renderPage("home");
  } catch (error) {
    alert(error.message);
  }
}

function logout(event) {
  event.preventDefault();
  const confirmLogout = confirm("Anda yakin akan keluar dari aplikasi ini?");
  if (!confirmLogout) return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("location");
  renderPage("login");
}

function takePicture(event) {
  event.preventDefault();

  navigator.camera.getPicture(
    (imageData) => {
      const image = document.querySelector("#myImage");
      image.src = imageData;
      image.classList.remove("hidden");
      document.querySelector("#image").value = imageData;
    },
    (message) => {
      alert("Gagal ambil gambar: " + message);
    },
    {
      quality: 30,
      destinationType: Camera.DestinationType.DATA_URL,
    }
  );
}

function base64ToBlob(base64, mime) {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

async function submitReport(event) {
  event.preventDefault();

  const confirmSubmit = confirm("Anda yakin akan mengirim laporan ini?");
  if (!confirmSubmit) return;

  const token = localStorage.getItem("token");
  const location = localStorage.getItem("location");
  const image = document.querySelector("#image").value;
  const keteranganTambahan = document.querySelector(
    "#keteranganTambahan"
  ).value;

  const checkboxes = Array.from(document.getElementsByName("keterangan"));
  const result = checkboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  result.push(keteranganTambahan);

  // Convert base64 image data to Blob
  const imageBlob = base64ToBlob(image, "image/jpeg");

  const formData = new FormData();
  formData.append("location", location);
  formData.append("result", result.join());
  formData.append("file", imageBlob, "image.jpg");

  try {
    const res = await fetch(`{API_URL}/api/inspections`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Laporan berhasil dikirim");
      renderPage("home");
    } else {
      alert("Gagal mengirim laporan");
    }
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Gagal mengirim laporan");
  }
}

function resetForm() {
  const locationElement = document.querySelector("#location");
  locationElement.classList.remove("success");
  locationElement.classList.add("error");
  document.querySelector("#reportForm").reset();
  document.querySelector("#myImage").classList.add("hidden");
}
