import {
  generateMnemonic,
  english,
  mnemonicToAccount,
  privateKeyToAccount,
  publicKeyToAddress,
  HDKey
} from "viem/accounts";

import {
  createPublicClient,
  createWalletClient,
  hashMessage,
  http,
  recoverPublicKey,
  verifyMessage
} from "viem";

import * as crypto from "crypto";
import { buffer } from "stream/consumers";
import { toBytes, toHex } from "viem";
import * as eccrypto from "eccrypto";
import base58 from "bs58check";

import PRE, { encryptData, Proxy } from "../src/lib";
import { mainnet } from "viem/chains";
import { publicClient } from "../src/services/client";

const mnemonic =
  "airport put edge nurse orange struggle scene account math shiver script angry";

describe("wallet", () => {
  it("can generate 12 words", () => {
    const result = generateMnemonic(english);

    expect(result.split(" ").length).toBe(12);
    expect(result).not.toBeNull();
  });

  it("using Proxy lib, encrypt and decrypt data", async () => {
    var kp_A = Proxy.generate_key_pair();
    var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
    var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());

    var sk_acc = toHex(kp_A.get_private_key().to_bytes());

    const account = privateKeyToAccount(sk_acc);

    console.log("pk length: ", kp_A.get_private_key().to_bytes().length);
    console.log("private key hex:", sk_A);

    const data = "test data";
    const x = PRE.encryptData(pk_A, data);
    const y = PRE.decryptData(sk_A, x);

    expect(y).toBe(data);
  });

  it("generate a signed message and verify the message", async () => {
    const mnemonic = generateMnemonic(english);
    const account = mnemonicToAccount(mnemonic);

    var wallet = await createWalletClient({
      account,
      chain: mainnet,
      transport: http()
    });

    const message = "sarmaad@gmail.com";

    const signature = await wallet.signMessage({
      account,
      message
    });

    console.log("address:", account.address);
    console.log("public key:", account.publicKey);
    console.log("signed message:", signature);

    const valid = await publicClient.verifyMessage({
      address: publicKeyToAddress(account.publicKey),
      message,
      signature: signature
    });
    console.log("is valid:", valid);

    expect(valid).toBe(true);
  });

  it("extract public key and verify signature", async () => {
    const mnemonic = generateMnemonic(english);
    const account = mnemonicToAccount(mnemonic);

    var wallet = await createWalletClient({
      account,
      chain: mainnet,
      transport: http()
    });

    const message = "sarmaad@gmail.com";

    const signature = await wallet.signMessage({
      account,
      message: message
    });

    console.log("address:", account.address);
    console.log("public key:", account.publicKey);
    console.log("signed message:", signature);

    // extract public key from signature
    const publicKey = await recoverPublicKey({
      hash: hashMessage(message),
      signature
    });

    const isVerified = await verifyMessage({
      address: publicKeyToAddress(publicKey),
      message: message,
      signature
    });

    expect(publicKey).toBe(account.publicKey);
    expect(isVerified).toBe(true);
  });

  it("using viem account to encrypt with proxy", async () => {
    const mnemonic = generateMnemonic(english);
    const account = mnemonicToAccount(mnemonic);

    console.log(account.publicKey.substring(2));
    console.log(Proxy.to_hex(account.getHdKey().publicKey));

    const sk_A = Proxy.to_hex(Buffer.from(account.getHdKey().privateKey!));
    const pk_A = account.publicKey.substring(2);

    // const encryptedData = PRE.encryptData(sk_A, "test data");
    // console.log('encrypted',encryptedData);

    // const y = PRE.decryptData(pk_A, encryptedData);
    // console.log('decrypted',y);

    var wallet = await createWalletClient({
      account,
      chain: mainnet,
      transport: http()
    });

    const sign = await wallet.signMessage({
      account,
      message: "sarmaad@gmail.com"
    });

    console.log("address:", account.address);
    console.log("public key:", account.publicKey);
    console.log("signed message:", sign);

    // const client = createPublicClient({
    //   chain: mainnet,
    //   transport: http()
    // });
    // const valid = await client.verifyMessage({
    //   address: account.address,
    //   message: "sarmaad@gmail.com",
    //   signature: sign
    // });
    // console.log("is valid:", valid);

    var okp_A = Proxy.generate_key_pair();

    var osk_A = Proxy.to_hex(okp_A.get_private_key().to_bytes());
    var opk_A = Proxy.to_hex(okp_A.get_public_key().to_bytes());

    // console.log('proxy',opk_A);
    // var sk_acc = toHex(okp_A.get_private_key().to_bytes());

    // const account = privateKeyToAccount(sk_acc);

    // var sk_A = Proxy.to_hex(account.getHdKey().privateKey?.buffer);

    // var pk_A = Proxy.to_hex(Buffer.from(account.getHdKey().publicKey!));
    // console.log('opk', opk_A)
    // console.log('pk', pk_A)

    // console.log('ext', account.getHdKey().publicExtendedKey)

    // var kp_A = Proxy.generate_key_pair();
    // var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
    // var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());

    // var sk_acc = toHex(kp_A.get_private_key().to_bytes());

    // const account = privateKeyToAccount(sk_acc);

    // console.log("account", account);

    // const x = PRE.encryptData(account.publicKey.substring(2), "test data");
    // console.log(x);

    // const y = PRE.decryptData(sk_A, x);
    // console.log(y);
  });
});
