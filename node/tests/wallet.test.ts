import {
  generateMnemonic,
  english,
  mnemonicToAccount,
  privateKeyToAccount,
  publicKeyToAddress,
  HDKey
} from "viem/accounts";

import { createWalletClient, http } from "viem";

import * as crypto from "crypto";
import { buffer } from "stream/consumers";
import { toBytes, toHex } from "viem";
import * as eccrypto from "eccrypto";
import base58 from "bs58check";

import PRE, { encryptData, Proxy } from "../src/lib";
import { mainnet } from "viem/chains";

const mnemonic =
  "airport put edge nurse orange struggle scene account math shiver script angry";

describe("wallet", () => {
  // it("can generate 12 words", () => {
  //   const result = generateMnemonic(english);

  //   expect(result.split(" ").length).toBe(12);
  //   expect(result).not.toBeNull();
  // });

  // it("using proxy re-encrypt generate account", async () => {
  //   var kp_A = Proxy.generate_key_pair();
  //   var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
  //   var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());

  //   var sk_acc = toHex(kp_A.get_private_key().to_bytes());

  //   const account = privateKeyToAccount(sk_acc);

  //   console.log("account", account);

  //   const x = PRE.encryptData(pk_A, "test data");
  //   console.log(x);

  //   const y = PRE.decryptData(sk_A, x);
  //   console.log(y);
  // });

  it("using viem account to encrypt with proxy", async () => {
    const mnemonic = generateMnemonic(english);
    const account = mnemonicToAccount(mnemonic);

    console.log(account.publicKey.substring(2));
    console.log(Proxy.to_hex(account.getHdKey().publicKey));
    

    // const client = createWalletClient({
    //   account: account,
    //   chain: mainnet,
    //   transport: http()
    // });

    // const [address] = await client.getAddresses();

    // console.log("address", address);


    // console.log(base58.decode(toHex(account.getHdKey().publicKey!)));
    // console.log(base58.decode(toHex(account.getHdKey().pubKeyHash!)));
    // //console.log(base58.decode('04fc9cb56b8a9fb746dbd7854c4f49406a5bb6c453277bcc301e88cc6e9f2d1c4fda53bf435557f11886c5932f13cb0a96060609cbcf5facd536406a38a53429dc').length)

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
