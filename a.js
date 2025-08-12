import crypto from "crypto";

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const header = {
  alg: "HS256",
  typ: "JWT"
};

const payload = {
  id: 1,
  role: "admin",
  iat: 1754830903,
  exp: 1754917303
};

const signKey = "your_secret"
// Encode header & payload
const encodedHeader = base64url(JSON.stringify(header));
const encodedPayload = base64url(JSON.stringify(payload));

// Create signature
const dataToSign = `${encodedHeader}.${encodedPayload}`;
const signature = crypto
  .createHmac("sha256", signKey)
  .update(dataToSign)
  .digest("base64")
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

// Final JWT
const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

console.log("✅ JWT:", jwt);
