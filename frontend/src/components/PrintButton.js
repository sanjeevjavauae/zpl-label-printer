import React, { useState } from "react";
import { printToNetwork } from "../api";

export default function PrintButton({ mappedRows }) {
  const [ip, setIp] = useState("");

  const sendPrint = async () => {
    if (!ip) {
      alert("Enter Printer IP");
      return;
    }
    await printToNetwork(mappedRows, ip);
    alert("Sent to printer!");
  };

  return (
    <div>
      <h3>Print to Network Printer</h3>
      <input
        type="text"
        placeholder="Printer IP"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <button onClick={sendPrint}>Print</button>
    </div>
  );
}
