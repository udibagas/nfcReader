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
    const response = await fetch("http://192.168.1.10:3000/api/login", {
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

function logout() {
  const confirmLogout = confirm("Are you sure you want to logout?");
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
      // alert(imageData);
      const image = document.getElementById("myImage");
      image.src = imageData;
    },
    (message) => {
      alert("Gagal ambil gambar: " + message);
    },
    {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
    }
  );
}

async function submitReport(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const location = localStorage.getItem("location");

  const keteranganTambahan = document.querySelector(
    "#keteranganTambahan"
  ).value;

  const checkboxes = Array.from(document.getElementsByName("keterangan"));
  const result = checkboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  result.push(keteranganTambahan);
  const report = { location, result: result.join() };

  try {
    const res = await fetch("http://192.168.1.10:3000/api/inspections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(report),
    });

    if (!res.ok) {
      throw new Error("Failed to submit report");
    }

    const data = await res.json();
    alert("Laporan berhasil dikirim");
    // alert(JSON.stringify(data));
    const locationElement = document.querySelector("#location");
    locationElement.classList.remove("success");
    locationElement.classList.add("error");
    document.querySelector("#reportForm").reset();
  } catch (error) {
    alert(error.message);
  }
}
