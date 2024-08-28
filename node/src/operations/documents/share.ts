import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";
import { ShareDocument, GetAttestation } from "../../services/sign-protocol";
import Share from "../../models/share";

import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  DataLocationOnChain
} from "@ethsign/sp-sdk";

export type ShareRequest = {
  email: string;
  expiry: number;
  proxyKey: string;
};

export const ShareDocumentHandler = async (req: Request, res: Response) => {
  if (!req.body) {
    console.log("error body is null:", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  const request: ShareRequest = req.body;

  // check if we have a wallet with this email address

  const recipientWallet = await collections.wallets?.findOne({
    email: request.email
  });

  if (!recipientWallet) {
    console.log("unable to find recipient email:", request.email);
    res.status(400).send("Invalid request!");
    return;
  }

  // make sure proxy key is not null or empty

  if(!request.proxyKey) {
    console.log("proxy key given was null or empty:", request.proxyKey);
    res.status(400).send("Invalid request!");
    return;
  }

  const { sub } = req.auth!;
  const { documentId } = req.params;

  const document = await collections.documents?.findOne({
    wallet_id: new ObjectId(sub),
    _id: new ObjectId(documentId)
  });

  if (!document) {
    console.log("document doesn't exist", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // Get owner's wallet address using document's wallet_id
  const ownerAddress = await collections.wallets?.findOne({
    _id: new ObjectId(sub)
  });

  if (!ownerAddress) {
    console.log("unable to find document's owner", document);
    res.status(400).send("Invalid request!");
    return;
  }

  // Create attestation with Sign protocol
  const shared = await ShareDocument(ownerAddress.publicKey, document.document_type, document._id.toString(), request.proxyKey, request.expiry, request.email);
  const attestationId = shared.attestationId;

  const attestation = await GetAttestation(attestationId);

  // Upload instance of share into db
  const result = await collections.shared?.insertOne({
    attestation_id: attestationId,
    valid_until: attestation.validUntil,
    document_id: document._id,
    wallet_id: recipientWallet._id
  } as Share);

  // Send email to intended recipient

  res.status(200).send(result);
};
