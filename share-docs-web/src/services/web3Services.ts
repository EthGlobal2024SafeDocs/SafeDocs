/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateKeyToAccount } from 'viem/accounts';
import { SignMessageReturnType, createWalletClient, http, toHex } from 'viem';
import { mainnet } from 'viem/chains';
import Proxy from '../lib/proxy';
import { encryptData, decryptData, generateReEncrytionKey } from '../lib';
import { EncryptedPayload, UserDocument } from '../models/api/document';

export const getSignature = async (email: string, sk_acc: any): Promise<SignMessageReturnType | undefined> => {
  const account = privateKeyToAccount(sk_acc);

  const wallet = await createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  });

  const signature = await wallet.signMessage({
    account,
    message: email
  });

  return signature ? signature : undefined;
}

export const getAccountDetails = async (email: string)
  :
  Promise<{
    signature?: string,
    sk_acc?: string,
    skey?: string,
    pkey?: string,
    error?: string,
  } | undefined> => {
  let kp_A;
  let sk_A;
  let pk_A;
  let sk_acc;
  let account;
  // Lets try to create a valid key pair.
  // We have to do that because it can generate invalid key pair.
  // Only try do to is 100 times then just fail.
  for (let i = 0; i < 100; i++) {
    try {
      kp_A = Proxy.generate_key_pair();
      sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
      pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());
      console.log(`1 - ${sk_A} - 2 - ${pk_A}`);
      sk_acc = toHex(kp_A.get_private_key().to_bytes());

      account = privateKeyToAccount(sk_acc);
      break;
    } catch (error) {
      console.log('Invalid pair key were generated. Error = ', error);
    }
  }
  if (!account || !pk_A || !sk_acc) {
    return { error: `Couldn't generate valid key pair.` };
  }

  const wallet = await createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  });

  const signature = await wallet.signMessage({
    account,
    message: email
  });
  return {
    signature: signature,
    skey: sk_A,
    pkey: pk_A,
    sk_acc: sk_acc,
  }
}

export const generateEncryptedPayload = (pubKey: string, userDocument: UserDocument): EncryptedPayload => {
  const encryptPayload = encryptData(pubKey, JSON.stringify(userDocument));
  return encryptPayload;
}

export const getDecryptedPayload = (sKey: string, payload: EncryptedPayload): UserDocument => {
  const pkey = Proxy.private_key_from_bytes(Proxy.from_hex(sKey));
  const pri = Proxy.to_hex(pkey.to_bytes());
  const decryptedData = decryptData(pri, payload);
  return JSON.parse(decryptedData) as UserDocument;
}

export const generateProxyKey = (aPriKey: string, bPunKey: string) => {
  const aPk = Proxy.private_key_from_bytes(Proxy.from_hex(aPriKey));
  const aPri = Proxy.to_hex(aPk.to_bytes());

  const bPk = Proxy.public_key_from_bytes(Proxy.from_hex(bPunKey));
  const bPub = Proxy.to_hex(bPk.to_bytes());

  const proxyKey = generateReEncrytionKey(aPri, bPub);
  return proxyKey;
}