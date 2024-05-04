import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

// const privateKeyPath = path.join(__dirname, "..", "..", "private_key.pem");
// console.log("PATH:", privateKeyPath);

// const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256"
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null
    };
  }
}
