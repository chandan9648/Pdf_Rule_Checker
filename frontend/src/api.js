import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export async function checkPdf(formData, onUploadProgress = null) {
  const res = await axios.post(`${API_BASE}/api/check`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress
  });
  return res.data;
}

export async function getSampleFileUrl() {
  const res = await axios.get(`${API_BASE}/api/sample-file`);
  return res.data;
}
