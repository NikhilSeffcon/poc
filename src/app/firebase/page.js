"use client";

import React, { useState, useRef } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import auth from "../firebase";

const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [message, setMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null); // Store confirmationResult
  const recaptchaContainerRef = useRef(null);

  const [otp, setOtp] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleSendCode = () => {
    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        console.log("recaptcha resolved..");
      },
    });

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setConfirmationResult(confirmationResult);
        setMessage("Verification code sent to your phone.");
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const handleSignInWithVerificationCode = () => {
    confirmationResult
      .confirm(verificationCode)
      .then((result) => {
        console.log(result);
        // User signed in successfully
        setMessage("Sign in successful!");
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  return (
    <div>
      <h2>Phone & Google Sign In</h2>
      <div>
        <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Phone Number" />
        <button onClick={handleSendCode}>Send Verification Code</button>
      </div>
      <div>
        <input type="text" value={verificationCode} onChange={handleVerificationCodeChange} placeholder="Verification Code" />
        <button onClick={handleSignInWithVerificationCode}>Sign In</button>
      </div>
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      <p>{message}</p>
    </div>
  );
};

export default PhoneSignIn;
