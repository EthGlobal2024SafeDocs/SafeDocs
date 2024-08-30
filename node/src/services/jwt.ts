import * as fs from "fs";
import jwt from "jsonwebtoken";
import Proxy from "../lib/proxy";
import { expressjwt } from "express-jwt";

const jwt_key = "jwtKey.key";

const getKey = () => {
  if (!fs.existsSync(jwt_key)) {
    const keys = Proxy.generate_key_pair();
    const pkHex = Proxy.to_hex(keys.get_private_key().to_bytes());
    fs.writeFileSync(jwt_key, pkHex);
  }

  let pk = Buffer.from(Proxy.from_hex(fs.readFileSync(jwt_key, "utf8")));
  return pk;
};

export const expiryInSeconds = 3600;
export function SignToken(payload: Object) {
  return jwt.sign(payload, getKey(), {
    expiresIn: expiryInSeconds
  });
}

export function ExpressJwt() {
  return expressjwt({ secret: getKey(), algorithms: ["HS256"] });
}
