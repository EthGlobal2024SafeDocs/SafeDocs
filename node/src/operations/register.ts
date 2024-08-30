import { Request, Response } from "express";
import Wallet from "../models/wallet";
import { collections } from "../services/database.services";

import { publicKeyToAddress } from "viem/accounts";
import {
  hashMessage,
  recoverPublicKey,
  Signature,
  verifyMessage
} from "viem";

export type RegisterRequest = {
  email: string;
  signature: Signature;
};

export const RegisterHandler = async (req: Request, res: Response) => {
  if (!req.body) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // check if we already have the email address or public key so we don't create duplicate
  const { email, signature }: RegisterRequest = req.body;

  // verify the signature is correct with value provided
  const publicKey = await recoverPublicKey({
    hash: hashMessage(email),
    signature
  });
  const address = publicKeyToAddress(publicKey);
  const valid = await verifyMessage({
    address: address,
    message: email,
    signature
  });

  if (!valid) {
    console.log("address:", address);
    console.log("error: signature failed verification", signature);
    res.status(400).send("Invalid request!");
    return;
  }

  // check for duplicates
  const walletExists = await collections.wallets?.findOne<Wallet>({
    $or: [
      {
        email: email
      },
      {
        public_key: publicKey
      }
    ]
  });

  if (walletExists) {
    console.log("error: duplicate wallet", email);
    res.status(400).send("Invalid request!");
    return;
  }

  const result = await collections.wallets?.insertOne({
    email,
    public_key: publicKey
  } as Wallet);

  result
    ? res.status(200).send({ _id: result.insertedId } as Wallet)
    : res.status(500);
};
