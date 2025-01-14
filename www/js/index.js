const token = localStorage.getItem("token");
let user = localStorage.getItem("user");
user = user ? JSON.parse(user) : null;
renderPage(token ? "home" : "login");

document.addEventListener("deviceready", ondDeviceReady);

function setLocation(location) {
  document.querySelector("#location").innerHTML = location;
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
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const credentials = { username, password, role: "user" };

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
    document.querySelector("#error").innerHTML = JSON.stringify(error);
  }
}
