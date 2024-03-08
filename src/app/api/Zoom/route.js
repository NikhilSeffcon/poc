import { NextResponse } from "next/server";
const KJUR = require("jsrsasign");

export async function POST(req) {
  // Parse the JSON request body
  const body = await req.json();

  // Extract meetingNumber from the parsed request body
  const { meetingNumber } = body;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 2 * 60 * 60;
  //   const iat = Math.round(new Date().getTime() / 1000) - 30; // Current time minus 30 seconds
  //   const exp = iat * 60 * 60 * 2; // Expiry set to 2 hours from the current time

  const Header = {
    alg: "HS256",
    typ: "JWT",
  };

  const Payload = {
    sdkKey: "oAJ4zl6XSp6R3iZ93ETmRA",
    mn: meetingNumber,
    role: 0,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(Header);
  const sPlayload = JSON.stringify(Payload);

  const meetingSignature = KJUR.KJUR.jws.JWS.sign("HS256", sHeader, sPlayload, "xQq89FbNTepRE10UiusPovAq5Bt07Bc6");

  return NextResponse.json({
    signature: meetingSignature,
    sdkKey: "oAJ4zl6XSp6R3iZ93ETmRA",
  });
}
