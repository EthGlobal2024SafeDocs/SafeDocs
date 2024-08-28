import { Response } from "express";
import { Request } from "express-jwt";
import { collections } from "../../services/database.services";
import { ObjectId } from "mongodb";
import { ShareDocument } from "../../services/sign";

export type ShareRequest = {
  email: string;
  expiry: BigInt;
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
    wallet_id: sub,
    _id: new ObjectId(documentId)
  });

  if (!document) {
    console.log("document doesn't exist", req.body);
    res.status(400).send("Invalid request!");
    return;
  }

  // we are all good, lets create the attestation for this document and email the recipient
    const shared = ShareDocument(document._id, request.proxyKey);

};
