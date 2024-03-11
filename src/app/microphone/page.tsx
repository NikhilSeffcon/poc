"use client";
import React from "react";
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

  const onButtonClick = () => {
    // send audio file to server or process it here
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-900">Audio Level:</span>
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
        </div>
        <div className="mt-4">
          <span className="text-gray-900">Recording State: {recordingState}</span>
          {recordingState === "stopped" && audioFile && (
            <div className="mt-4">
              <span className="text-gray-900">Audio File:</span>
              <audio src={audioURL} controls className="mt-4"></audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HookDemo;
