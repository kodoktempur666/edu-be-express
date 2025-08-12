import { generateKeyPairSync } from "crypto";
import fs from "fs";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

// Ubah newline asli menjadi \n literal
const privateKeyOneLine = privateKey.replace(/\n/g, "\\n");
const publicKeyOneLine = publicKey.replace(/\n/g, "\\n");

// Simpan ke txt
fs.writeFileSync("private.txt", privateKeyOneLine);
fs.writeFileSync("public.txt", publicKeyOneLine);

console.log("✅ RSA key pair generated in one-line format!");
