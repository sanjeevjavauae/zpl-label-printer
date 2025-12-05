import axios from "axios";

const API = "http://localhost:8080";

// ---------------- Fetch Products ----------------
export async function fetchProducts() {
  const res = await axios.get(`${API}/api/products`);
  return res.data;
}

// ---------------- Upload Excel (Generic) ----------------
export async function uploadExcelGeneric(formData) {
  const res = await axios.post(`${API}/api/uploadExcelGeneric`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---------------- Preview Label ----------------
export async function previewProduct(product, template) {
  const res = await axios.post(`${API}/api/preview`, {
    mappedRows: [product],
    template
  });
  return res.data;
}

// ---------------- Print to Network Printer ----------------
export async function printToNetwork(product, template, printerIp, quantity) {
  const res = await axios.post(`${API}/api/printToNetwork`, {
    mappedRows: [product],
    printerIp,
    quantity,
    template
  });
  return res.data;
}

