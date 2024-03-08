"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const QrScanner = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner), {
  ssr: false,
});

const Scanner = () => {
  const [isScannerOn, setIsScannerOn] = useState(false);
  const [text, setText] = useState("");
  return (
    <>
      <button onClick={() => setIsScannerOn((prev) => !prev)}>{`${isScannerOn ? "Stop" : "Start"} Scanner`}</button>
      <h3>{text ? text : ""}</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Adjust height as needed
        }}
      >
        <QrScanner
          stopDecoding={!isScannerOn}
          containerStyle={{
            width: "500px",
            height: "500px",
          }}
          onDecode={(result) => setText(result)}
          onError={(error) => console.log(error?.message)}
        />
      </div>
    </>
  );
};

export default Scanner;
