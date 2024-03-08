const KJUR = require("jsrsasign");

export default function POST(req, res) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat * 60 * 60 * 2;

  const Header = {
    alg: "HS256",
    typ: "jwt",
  };

  const Payload = {
    sdkKey: "oAJ4zl6XSp6R3iZ93ETmRA",
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(Header);
  const sPlayload = JSON.stringify(Payload);

  const meetingSignature = KJUR.KJUR.jws.JWS.sign("HS256", sHeader, sPlayload, "xQq89FbNTepRE10UiusPovAq5Bt07Bc6");

  return res.json({
    signature: meetingSignature,
    sdkKey: "oAJ4zl6XSp6R3iZ93ETmRA",
  });
}
