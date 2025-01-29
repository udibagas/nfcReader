import axios from "axios";
const API_URL = "http://192.168.1.6:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers
    ? (config.headers.Authorization = `Bearer ${token}`)
    : (config.headers = config.headers || `Bearer ${token}`);
  return config;
});

export async function login({ name, password }) {
  const { data } = await axiosInstance.post(`/api/login`, {
    name,
    password,
  });
  const { token, user } = data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function register({ name, password, SiteId }) {
  return axiosInstance.post(`/api/register`, {
    name,
    password,
    SiteId,
    role: "user",
  });
}

export function logout() {
  return axiosInstance.post(`/api/logout`);
}

export async function getUser() {
  const { data } = await axiosInstance.get(`/api/me`);
  return data;
}

export async function saveData(data, files) {
  const { location, keterangan = [], keteranganTambahan } = data;

  if (!location) {
    throw new Error("Lokasi harus diisi!");
  }

  if (keteranganTambahan) {
    keterangan.push(keteranganTambahan);
  }

  const result = keterangan.join();
  const formData = new FormData();
  formData.append("location", location);
  formData.append("result", result);

  if (files.length > 0) {
    files.forEach((file) => {
      formData.append("images[]", file);
    });
  }

  return axiosInstance.post(`/api/inspections`, formData);
}

export function getTemplates() {
  return axiosInstance.get(`/api/inspection-templates`);
}

export async function getSites() {
  const { data } = await axiosInstance.post("/graphql", {
    query: `{ 
      sites {
        id
        name
      }
    }`,
  });

  return data.data.sites;
}

export function base64ToBlob(base64, mime) {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}
