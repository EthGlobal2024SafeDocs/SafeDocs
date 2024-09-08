import { decryptData, encryptData } from "@/lib";
import Proxy from "@/lib/proxy";
import { Buffer } from "buffer";

export type EncryptedPayload = {
  key: string;
  cipher: string;
};

export const DecryptPayload = async (key: string, payload: EncryptedPayload) => {
  const pk = Proxy.private_key_from_bytes(Proxy.from_hex(key));
  var pri = Proxy.to_hex(pk.to_bytes());

  const decryptedData: string = decryptData(pri, payload);

  return decryptedData;
};

export const EncryptPayload = async (key: string, payload: string) => {
  const pk = Proxy.private_key_from_bytes(Proxy.from_hex(key));
  var pubKey = Proxy.to_hex(pk.get_public_key().to_bytes());

  return encryptData(pubKey, payload) as EncryptedPayload;
};

export const DecryptPayloadBulk = async (key: string, payloads: Array<{ key: string; payload: EncryptedPayload }>) => {
  const pk = Proxy.private_key_from_bytes(Proxy.from_hex(key));
  var pri = Proxy.to_hex(pk.to_bytes());

  const result = payloads.map((i) => {
    try {
      // decrypt a document
      return {
        key: i.key,
        payload: decryptData(pri, i.payload) as string,
      };
    } catch (e) {}
  });

  return result;
};

export const HexToBase64 = (hex: string) => {
  const bytes = Proxy.from_hex(hex);
  return Buffer.from(bytes).toString("base64");
};
