import React, { useState } from "react";
import { printProduct } from "../api";

export default function PrintButton({ mappedRows, selectedTemplate }) {
  const [ip, setIp] = useState("");

  const sendPrint = async () => {
    if (!ip) {
      alert("Enter Printer IP");
      return;
    }

    if (!selectedTemplate) {
      alert("Select a label template first");
      return;
    }

    try {
      await printProduct(mappedRows, ip, 1, selectedTemplate);
      alert("Sent to printer!");
    } catch (err) {
      console.error("Print error:", err);
      alert("Failed to print. Check console for details.");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Print to Network Printer</h3>
      <input
        type="text"
        placeholder="Printer IP"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={sendPrint}>Print</button>
    </div>
  );
}
