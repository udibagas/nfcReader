import axios from "axios";
const API_URL = "http://localhost:3000";

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

export async function register(name, password, SiteId) {
  const { data } = await axiosInstance.post(`/api/register`, {
    name,
    password,
    SiteId,
  });
  const { token, user } = data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  return axiosInstance.post(`/api/logout`);
}

export async function getUser() {
  const { data } = await axiosInstance.get(`/api/me`);
  return data;
}

export function saveData(data) {
  const { location, keterangan, keteranganTambahan } = data;

  if (keteranganTambahan) {
    keterangan.push(keteranganTambahan);
  }

  const result = keterangan.join(",");
  return axiosInstance.post(`/api/inspections`, { location, result });
}

export function getTemplates() {
  return axiosInstance.get(`/api/inspection-templates`);
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
