"use client";
import React, { useEffect, useState } from "react";
import { useRecorder } from "react-microphone-recorder";

const HookDemo = () => {
  const {
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    resumeRecording,
    audioLevel,
    timeElapsed,
    recordingState,
    audioURL,
    audioFile,
    isRecording,
  } = useRecorder();

  const [enableTimer, setEnableTimer] = useState(false);

  useEffect(() => {
    let timer;

    // console.log(isRecording);
    if (isRecording && enableTimer) {
      // Set timer to stop recording after 1 minute (60000 milliseconds)
      timer = setTimeout(() => {
        stopRecording();
      }, 5000);
    }

    // Clean up the timer when the component unmounts or recording stops
    return () => clearTimeout(timer);
  }, [isRecording]);

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute("href", audioURL);
    element.setAttribute("download", "recorded-audio.wav");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <button onClick={() => setEnableTimer((prev) => !prev)} className="px-4 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-600">
          {enableTimer ? "Disable Timer" : "Enable Timer"}
        </button>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-900">Audio Level: </span>
            <span className="text-gray-900">{audioLevel}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className={"h-full w-full bg-green-500 rounded-full"}></div>
          </div>
        </div>
        <div className="mb-4">
          <span className="text-gray-900">Time: {timeElapsed}s</span>
        </div>
        <div className="flex justify-between">
          <button onClick={startRecording} className="px-4 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-600">
            Start
          </button>
          {recordingState === "paused" ? (
            <button onClick={resumeRecording} className="px-4 py-2 text-white bg-green-500 rounded shadow hover:bg-green-600">
              Resume
            </button>
          ) : (
            <button onClick={pauseRecording} className="px-4 py-2 text-white bg-yellow-500 rounded shadow hover:bg-yellow-600">
              Pause
            </button>
          )}
          <button onClick={stopRecording} className="px-4 py-2 text-white bg-red-500 rounded shadow hover:bg-red-600">
            Stop
          </button>
          <button onClick={resetRecording} className="px-4 py-2 text-white bg-gray-500 rounded shadow hover:bg-gray-600">
            Reset
          </button>
          {recordingState === "stopped" && audioFile && (
            <button onClick={handleDownload} className="px-4 py-2 text-white bg-purple-500 rounded shadow hover:bg-purple-600">
              Download
            </button>
          )}
        </div>
        <div className="mt-4">
          <span className="text-gray-900">Recording State: {recordingState}</span>
          {recordingState === "stopped" && audioFile && (
            <div className="mt-4">
              <span className="text-gray-900">Audio File:</span>
              <audio src={audioURL} preload="auto" controls className="mt-4"></audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HookDemo;
