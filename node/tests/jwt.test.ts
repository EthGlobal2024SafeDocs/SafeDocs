import jwt from "jsonwebtoken";
import Proxy from "../src/lib/proxy";
import * as fs from "fs";

const jwt_key = "jwtKey.key";

beforeAll(async () => {
  if (!(await fs.existsSync(jwt_key))) {
    const keys = Proxy.generate_key_pair();
    const pkHex = Proxy.to_hex(keys.get_private_key().to_bytes());
    fs.writeFileSync(jwt_key, pkHex);
  }
});

it("create a jwt and fail validation", async () => {
  let pk = Buffer.from(Proxy.from_hex(fs.readFileSync(jwt_key, "utf8")));

  const message = { claim: "hello" };

  const token = jwt.sign(message, pk, {});

  expect(() => {
    const data = jwt.verify(token, "aa");
  }).toThrow();
});

it("create a jwt and successfully verify", async () => {
  let pk = Buffer.from(Proxy.from_hex(fs.readFileSync(jwt_key, "utf8")));

  const message = { claim: "hello" };
  const token = jwt.sign(message, pk, {});

  expect(() => {
    const data = jwt.verify(token, pk);
    expect(data).toBeTruthy();
  }).not.toThrow();
});
