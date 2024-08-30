import { Signature, hashMessage, recoverPublicKey, verifyMessage } from "viem";

import { publicKeyToAddress } from "viem/accounts";

import { Request, Response } from "express";

import Wallet from "../models/wallet";
import { collections } from "../services/database.services";
import { expiryInSeconds, SignToken } from "../services/jwt";

export type LoginRequest = {
  email: string;
  signature: Signature;
};

export const LoginHandler = async (req: Request, res: Response) => {
  // Handle empty request
  if (!req.body) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const { email, signature }: LoginRequest = req.body;

  // Get public key from email and signature
  const emailHash = hashMessage(email);

  const publicKey = await recoverPublicKey({
    hash: emailHash,
    signature
  });

  // verify signature from value provided
  const address = publicKeyToAddress(publicKey);

  const valid = verifyMessage({
    address: address,
    message: email,
    signature: signature
  });

  if (!valid) {
    console.log("address:", address);
    console.log("error: signature failed verification", signature);
    res.status(400).send("Invalid request!");
    return;
  }

  // Check to see if wallet actually exists
  const wallet = await collections.wallets?.findOne<Wallet>({
    $or: [
      {
        email: email
      },
      {
        public_key: publicKey
      }
    ]
  });

  if (!wallet) {
    console.log("wallet doesn't exist", email, publicKey);
    res.status(400).send("Invalid request!");
    return;
  }

  // Wallet exists now we create JWT token and return to user
  

  const token = SignToken({
    sub: wallet._id,
    email: wallet.email
  });

  res.status(200).send({
    token,
    expiryIn: expiryInSeconds
  });
};
