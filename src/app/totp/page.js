"use client";
import React, { useState, useRef } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  getMultiFactorResolver,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  TotpMultiFactorGenerator,
} from "firebase/auth";
import auth from "../firebase";
import QRCode from "react-qr-code";
import SignatureCanvas from "react-signature-canvas";

const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [totpVerificationCode, setTotpVerificationCode] = useState("");
  const [userData, setUserData] = useState(null);
  const [verificationId, setVerificationId] = useState("");
  const [message, setMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaContainerRef = useRef(null);
  const [qrValue, setQRValue] = useState(null);
  const [totpSecretKey, setTotpSecretKey] = useState(null);

  const [showQRCode, setShowQRCode] = useState(false);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleVerificationTotpCodeChange = (event) => {
    setTotpVerificationCode(event.target.value);
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
        setMessage("Sign in successful!");
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const handleMultiFactorChallenge = async (resolver) => {
    const enrolledFactors = resolver.hints.map((info) => info.displayName);

    console.log("-----enrolledFactors----", enrolledFactors);

    const selectedIndex = 0;

    switch (resolver.hints[selectedIndex].factorId) {
      case TotpMultiFactorGenerator.FACTOR_ID:
        const otpFromAuthenticator = prompt("Please enter the verification code:");
        const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(resolver.hints[selectedIndex].uid, otpFromAuthenticator);
        try {
          const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
          // Successfully signed in!
          console.log("Success: ", userCredential);
        } catch (error) {
          // Invalid or expired OTP.
          console.log(error);
        }
        break;
      case PhoneMultiFactorGenerator.FACTOR_ID:
        // Handle SMS second factor.
        console.log("----hello----");
        break;
      default:
        // Unsupported second factor?
        console.log("----no hello ----");
        break;
    }

    // if (resolver.hints[0].factorId === "phone") {
    //   const phoneNumber = prompt("Please enter your phone number:");

    //   // Create a RecaptchaVerifier instance

    //   const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    //     size: "invisible",
    //     callback: () => {
    //       console.log("recaptcha resolved..");
    //     },
    //   });

    //   // Create a phone auth provider instance
    //   const phoneAuthProvider = new PhoneAuthProvider(auth);

    //   // Send a verification code to the provided phone number
    //   phoneAuthProvider
    //     .verifyPhoneNumber(phoneNumber, recaptchaVerifier)
    //     .then((verificationId) => {
    //       // Ask the user to enter the verification code
    //       const verificationCode = prompt("Please enter the verification code:");

    //       // Create a credential with the verification ID and verification code
    //       const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    //       console.log(credential);
    //       // Complete the second factor authentication
    //       resolver
    //         .resolveSignIn(credential)
    //         .then((userCredential) => {
    //           console.log("=======userCredential====", userCredential);
    //           // User successfully completed multi-factor authentication
    //           console.log("Multi-factor authentication successful:", userCredential.user);
    //         })
    //         .catch((error) => {
    //           console.error("Error completing multi-factor authentication:", error);
    //         });
    //     })
    //     .catch((error) => {
    //       console.error("Error sending verification code:", error);
    //     });
    // }
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      // Replace 'YOUR_TENANT_ID' with your actual tenant ID
      tenantId: "mfa-users-p50um",
    });

    signInWithPopup(auth, provider)
      .then(async (result) => {
        let user = result.user;
        console.log(result);
        setUserData(user);
        //enrollUsersToMFA(user);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/multi-factor-auth-required") {
          console.log(JSON.stringify(auth));
          //const resolver = getMultiFactorResolver(auth, error);
          // handleMultiFactorChallenge(resolver);
          // console.log(userData);
          // enrollUsersToMFA(userData);

          let userAuth = auth.currentUser;

          if (userAuth) {
            userAuth.multiFactor
              .getSession()
              .then((session) => {
                const enrolledFactors = session.enrolledFactors;
                enrolledFactors.forEach((factorInfo) => {
                  if (factorInfo.displayName === "TOTP") {
                    console.log("User is enrolled for TOTP MFA");
                    // Handle the case where TOTP is enrolled
                  }
                });
              })
              .catch((error) => {
                console.error("Error getting multi-factor session:", error);
              });
          } else {
            console.log("No user signed in.");
          }
        } else if (error.code === "auth/wrong-password") {
          setMessage(`Error: ${error.message}`);
        }
      });
  };

  const enrollUsersToMFA = async (currentUser) => {
    const multiFactorSession = await multiFactor(currentUser).getSession();
    const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);

    const totpUri = totpSecret.generateQrCodeUrl(currentUser.email, "MFA POC");

    setQRValue(totpUri);

    const secret = totpSecret.secretKey;

    setTotpSecretKey(totpSecret);
  };

  const verifyMFACode = async () => {
    console.log("========totpVerificationCode======", totpVerificationCode);
    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecretKey, totpVerificationCode);
    await multiFactor(userData).enroll(multiFactorAssertion, "MFA TOTP POC");
  };

  const handleSignInWithTotpVerificationCode = async () => {
    verifyMFACode();
  };

  return (
    <div>
      <h2>Phone & Google Sign In</h2>
      {qrValue && (
        <div style={{ background: "white", padding: "16px" }}>
          <QRCode value={qrValue} />
        </div>
      )}
      <div>
        <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Phone Number" />
        <button onClick={handleSendCode}>Send Verification Code</button>
      </div>
      <div>
        <input type="text" value={verificationCode} onChange={handleVerificationCodeChange} placeholder="Verification Code" />
        <button onClick={handleSignInWithVerificationCode}>Sign In</button>
      </div>
      <div>
        <button onClick={handleSignInWithGoogle}>Sign In with Google</button>
      </div>
      <div>
        <input type="text" value={totpVerificationCode} onChange={handleVerificationTotpCodeChange} placeholder="TOTP Code" />
        <button onClick={handleSignInWithTotpVerificationCode}>Sign In</button>
      </div>
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      <p>{message}</p>
      <SignatureCanvas penColor="green" canvasProps={{ width: 500, height: 200, className: "sigCanvas" }} />
    </div>
  );
};

export default PhoneSignIn;
