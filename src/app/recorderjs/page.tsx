"use client";
import React, { useState, useRef } from "react";

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = handleDataAvailable;
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch((error) => console.log("Error:", error));
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  const handleDataAvailable = (event) => {
    console.log(event.data);
    chunks.current.push(event.data);
  };

  const handleDownload = () => {
    const blob = new Blob(chunks.current, { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>{recording ? "Stop Recording" : "Start Recording"}</button>
      <button onClick={handleDownload}>Download Recording</button>
      {audioURL && <audio controls src={audioURL}></audio>}
    </div>
  );
}

export default AudioRecorder;
