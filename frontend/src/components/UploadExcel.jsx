import React, { useState } from "react";
import axios from "axios";

export default function UploadExcel() {
  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleExcelChange = (e) => setExcelFile(e.target.files[0]);
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!excelFile) {
      setMessage("Please select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    // Optional: append image if needed
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/uploadExcelGeneric",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Uploaded Data:", res.data);
      setMessage("Excel uploaded successfully! Check console for parsed data.");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Upload Excel / Optional Image</h3>
      <div style={{ marginBottom: "10px" }}>
        <input type="file" accept=".xlsx" onChange={handleExcelChange} />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button onClick={handleUpload}>Upload</button>
      {message && <div style={{ marginTop: "10px", color: "red" }}>{message}</div>}
    </div>
  );
}
